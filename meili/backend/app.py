# backend/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask import render_template

import jwt, datetime, os
from meilisearch import Client

app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = os.getenv('SECRET', 'dev_secret')
meili = Client('http://localhost:7700', None)

def token_required(f):
    from functools import wraps
    @wraps(f)
    def decorated(*args, **kwargs):
        auth = request.headers.get('Authorization', '')
        if not auth.startswith('Bearer '):
            return jsonify({"msg":"Missing token"}), 401
        try:
            jwt.decode(auth[7:], app.config['SECRET_KEY'], algorithms=['HS256'])
        except Exception:
            return jsonify({"msg":"Invalid token"}), 401
        return f(*args, **kwargs)
    return decorated

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    # Our *demo* user: email=admin@example.com, pwd=pass123
    if data.get('email') == 'admin@example.com' and data.get('password') == 'pass123':
        token = jwt.encode({
            'sub': data['email'],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=2)
        }, app.config['SECRET_KEY'], algorithm='HS256')
        return jsonify({"access_token": token})
    return jsonify({"msg":"Bad credentials"}), 401

@app.route('/me')
@token_required
def me():
    return jsonify({"msg":"You are authenticated"}), 200

@app.route('/patient/<patient_id>')
@token_required
def get_patient(patient_id):
    try:
        record = meili.index('patients').get_document(patient_id)
        return jsonify(record), 200
    except Exception:
        return jsonify({"msg":"Patient not found"}), 404

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0")

@app.route('/tag/<patient_id>')
def show_tag_page(patient_id):
    try:
        patient = meili.index('patients').get_document(patient_id)
        return render_template(
            'patient_tag.html',
            patient=patient,
            page_title=f"Patient {patient.get('name', patient_id)}"
        )
    except Exception:
         return render_template(
            'patient_not_found.html',
            patient_id=patient_id,
            page_title="Patient not found"
        ), 404
# --------------------------------------------------------------
