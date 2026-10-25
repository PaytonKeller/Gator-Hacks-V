
import sqlite3
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from config import Config

try:
    from meilisearch import Client
    meili = Client(getattr(Config, "MEILI_URL", "http://localhost:7700"), getattr(Config, "MEILI_KEY", None))
except Exception:
    meili = None
# Create the Blueprint for patient routes
patients_bp = Blueprint("patients", __name__)

def get_db_connection():
    conn = sqlite3.connect(Config.DATABASE_URL)
    conn.row_factory = sqlite3.Row
    return conn

def log_patient_access(nurse_id, patient_id):
    """Automatically records a row in access_log whenever a nurse views a patient."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO access_log (nurse_id, patient_id) VALUES (?, ?)",
        (nurse_id, patient_id)
    )
    conn.commit()
    conn.close()

@patients_bp.route("/patient/<lookup_id>", methods=["GET"])
@jwt_required()
def get_patient(lookup_id):
    # 1. Identify which nurse is making the request from their JWT token
    current_nurse_id = get_jwt_identity()
    
    if meili is not None:
        try:
            record = meili.index("patients").get_document(lookup_id)
            log_patient_access(current_nurse_id, record.get("id", lookup_id))
            return jsonify(record), 200
        except Exception:
            pass  # If not in Meili or server is down, fall back to SQLite below!

    conn = get_db_connection()
    cursor = conn.cursor()

    # 2. Look up the patient by EITHER their 'nfc_tag_id' (NFC-TAG-101) OR 'id' (PAT-001)
    cursor.execute(
        "SELECT * FROM patients WHERE nfc_tag_id = ? OR id = ?",
        (lookup_id, lookup_id)
    )
    patient = cursor.fetchone()

    if patient is None:
        conn.close()
        return jsonify({"error": "Patient not found"}), 404

    # 3. Fetch this patient's most recent vitals record
    cursor.execute(
        """
        SELECT blood_pressure, heart_rate, temperature, oxygen_sat, recorded_by, recorded_at
        FROM vitals
        WHERE patient_id = ?
        ORDER BY recorded_at DESC
        LIMIT 1
        """,
        (patient["id"],)
    )
    latest_vitals = cursor.fetchone()
    conn.close()

    # 4. Log this scan in the access_log table
    log_patient_access(current_nurse_id, patient["id"])

    # 5. Combine the patient profile and their latest vitals into one JSON response
    response_data = dict(patient)
    response_data["latest_vitals"] = dict(latest_vitals) if latest_vitals else None

    return jsonify(response_data), 200

@patients_bp.route("/patient/<patient_id>/vitals", methods=["POST"])
@jwt_required()
def add_vitals(patient_id):
    current_nurse_id = get_jwt_identity()
    data = request.get_json()

    if not data:
        return jsonify({"error": "Vitals data is required"}), 400

    blood_pressure = data.get("blood_pressure")
    heart_rate = data.get("heart_rate")
    temperature = data.get("temperature")
    oxygen_sat = data.get("oxygen_sat")

    conn = get_db_connection()
    cursor = conn.cursor()

    # 1. Verify patient exists (by id or nfc_tag_id)
    cursor.execute(
        "SELECT id FROM patients WHERE id = ? OR nfc_tag_id = ?",
        (patient_id, patient_id)
    )
    patient = cursor.fetchone()

    if patient is None:
        conn.close()
        return jsonify({"error": "Patient not found"}), 404

    actual_patient_id = patient["id"]

    # 2. Insert the new vitals reading into SQLite
    cursor.execute(
        """
        INSERT INTO vitals (patient_id, recorded_by, blood_pressure, heart_rate, temperature, oxygen_sat)
        VALUES (?, ?, ?, ?, ?, ?)
        """,
        (actual_patient_id, current_nurse_id, blood_pressure, heart_rate, temperature, oxygen_sat)
    )
    conn.commit()
    conn.close()

    return jsonify({
        "message": "Vitals recorded successfully",
        "patient_id": actual_patient_id,
        "recorded_by": current_nurse_id
    }), 201