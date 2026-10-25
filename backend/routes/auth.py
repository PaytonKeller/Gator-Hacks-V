import sqlite3
from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt_identity
)
from config import Config

# blueprint named 'auth' with URL prefix '/auth'
auth_bp = Blueprint("auth", __name__, url_prefix="/auth")

def get_db_connection():
    conn = sqlite3.connect(Config.DATABASE_URL if hasattr(Config, "DATABASE_URL") else "database.db")
    conn.row_factory = sqlite3.Row  # Lets us access columns by name like nurse["name"]
    return conn

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    #Validate that both id and password were sent in the JSON body
    if not data or not data.get("id") or not data.get("password"):
        return jsonify({"error": "Employee ID and password are required"}), 400

    nurse_id = data.get("id")
    password = data.get("password")

    #Look up the nurse in SQLite
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM nurses WHERE id = ?", (nurse_id,))
    nurse = cursor.fetchone()
    conn.close()

    #Verify nurse exists and password matches the stored hash
    if nurse is None or not check_password_hash(nurse["password_hash"], password):
        return jsonify({"error": "Invalid employee ID or password"}), 401

    #Generate JWT Access & Refresh Tokens
    access_token = create_access_token(
        identity=nurse["id"],
        additional_claims={"role": nurse["role"], "name": nurse["name"]}
    )
    refresh_token = create_refresh_token(identity=nurse["id"])

    #Return tokens and nurse profile to the React Native app
    return jsonify({
        "message": "Login successful",
        "access_token": access_token,
        "refresh_token": refresh_token,
        "nurse": {
            "id": nurse["id"],
            "name": nurse["name"],
            "role": nurse["role"]
        }
    }), 200

@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def get_current_nurse():
    current_nurse_id = get_jwt_identity()

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT id, name, role, created_at FROM nurses WHERE id = ?", (current_nurse_id,)
    )
    nurse = cursor.fetchone()
    conn.close()

    if nurse is None:
        return jsonify({"error": "Nurse not found"}), 404

    return jsonify({
        "id": nurse["id"],
        "name": nurse["name"],
        "role": nurse["role"],
        "created_at": nurse["created_at"]
    }), 200

@auth_bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    # 1. Get the nurse's identity from the valid refresh token
    current_nurse_id = get_jwt_identity()

    # 2. Look up their current role and name to include in the new access token
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT name, role FROM nurses WHERE id = ?", (current_nurse_id,))
    nurse = cursor.fetchone()
    conn.close()

    if nurse is None:
        return jsonify({"error": "Nurse not found"}), 404

    # 3. Issue a brand new 15-minute access token
    new_access_token = create_access_token(
        identity=current_nurse_id,
        additional_claims={"role": nurse["role"], "name": nurse["name"]}
    )

    return jsonify({
        "access_token": new_access_token
    }), 200


