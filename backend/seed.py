import sqlite3
from werkzeug.security import generate_password_hash
from models.db import init_db

def seed_data():
    # Ensure all 4 tables exist before inserting data
    init_db()
    
    # Connect to the SQLite database
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    
    print("Connected to database.db...")
#fake nurses
    nurses = [
        ("CNA-001", "Alice Johnson", generate_password_hash("password123"), "CNA"),
        ("CNA-002", "Marcus Vance", generate_password_hash("password123"), "CNA"),
        ("RN-001", "Sarah Chen", generate_password_hash("adminpass"), "RN")
    ]

    cursor.executemany("""
        INSERT OR IGNORE INTO nurses (id, name, password_hash, role)
        VALUES (?, ?, ?, ?)
    """, nurses)
    
    print("Seeded nurses...")
#fake patients
    patients = [
        (
            "PAT-001", 
            "NFC-TAG-101", 
            "Eleanor Vance", 
            "1948-05-14", 
            "204A", 
            "Post-op Hip Replacement", 
            "Penicillin, Latex"
        ),
        (
            "PAT-002", 
            "NFC-TAG-102", 
            "Robert Miller", 
            "1955-11-22", 
            "204B", 
            "Type 2 Diabetes, Hypertension", 
            "None"
        ),
        (
            "PAT-003", 
            "NFC-TAG-103", 
            "Clara Oswald", 
            "1962-03-08", 
            "210A", 
            "Congestive Heart Failure", 
            "Sulfa Drugs, Peanuts"
        )
    ]

    cursor.executemany("""
        INSERT OR IGNORE INTO patients (id, nfc_tag_id, name, dob, room_number, diagnosis, allergies)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, patients)

    print("Seeded patients...")

    # 3. Seed Vitals (Clearing first so we don't duplicate on re-runs)
    cursor.execute("DELETE FROM vitals")
    
    vitals = [
        ("PAT-001", "CNA-001", "122/78", 74, 98.6, 98),
        ("PAT-002", "CNA-001", "138/88", 82, 99.1, 96),
        ("PAT-003", "CNA-002", "118/75", 68, 98.4, 99)
    ]

    cursor.executemany("""
        INSERT INTO vitals (patient_id, recorded_by, blood_pressure, heart_rate, temperature, oxygen_sat)
        VALUES (?, ?, ?, ?, ?, ?)
    """, vitals)

    print("Seeded vitals...")

    # 4. Seed Access Log
    cursor.execute("DELETE FROM access_log")

    access_logs = [
        ("CNA-001", "PAT-001"),
        ("CNA-001", "PAT-002"),
        ("CNA-002", "PAT-003")
    ]

    cursor.executemany("""
        INSERT INTO access_log (nurse_id, patient_id)
        VALUES (?, ?)
    """, access_logs)

    print("Seeded access logs...")

    # 5. Save (commit) changes and close the connection
    conn.commit()
    conn.close()
    print("✅ Database seeding complete!")

if __name__ == "__main__":
    seed_data()