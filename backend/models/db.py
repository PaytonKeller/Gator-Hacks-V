import sqlite3
from config  import Config

def get_db():
    conn = sqlite3.connect(Config.database_url)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS alerts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            patient_id TEXT REFERENCES patients(id),
            room_number TEXT,
            status TEXT DEFAULT 'PENDING',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS nurses (
            id              TEXT PRIMARY KEY,
            name            TEXT NOT NULL,
            password_hash   TEXT NOT NULL,
            role            TEXT DEFAULT 'CNA',
            created_at          DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
 #extra patient info
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS patients (
            id              TEXT PRIMARY KEY,
            nfc_tag_id      TEXT UNIQUE NOT NULL,
            name            TEXT NOT NULL,
            dob             DATE,
            room_number     TEXT,
            diagnosis       TEXT,
            allergies       TEXT,
            created_at      DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)
 #vitals
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS vitals (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            patient_id      TEXT REFERENCES patients(id),
            recorded_by     TEXT REFERENCES nurses(id),
            blood_pressure  TEXT,
            heart_rate      INTEGER,
            temperature     REAL,
            oxygen_sat      INTEGER,
            recorded_at     DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS access_log (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            nurse_id        TEXT REFERENCES nurses(id),
            patient_id      TEXT REFERENCES patients(id),
            accessed_at     DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)

    conn.commit()
    conn.close()
    print("Database initialized.")