from flask import Blueprint, request, jsonify
import sqlite3

from backend.database import get_db_connection

bp_subjects = Blueprint("subjects", __name__)


@bp_subjects.route("/subjects", methods=["GET"])
def get_subjects():
    conn = get_db_connection()
    rows = conn.execute("SELECT * FROM subjects").fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])


@bp_subjects.route("/subjects", methods=["POST"])
def create_subject():
    data = request.get_json()
    try:
        conn = get_db_connection()
        conn.execute(
            "INSERT INTO subjects (subject_code, subject_name, subject_teacher_id) VALUES (?, ?, ?)",
            (
                data.get("subject_code"),
                data.get("subject_name"),
                data.get("teacher_id"),
            ),
        )
        conn.commit()
        conn.close()
        return jsonify({"message": "Subject created"}), 201
    except sqlite3.Error as e:
        return jsonify({"error": str(e)}), 400
