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


@bp_subjects.route("/subjects/<int:id>", methods=["PATCH"])
def update_subject(id):
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    fields = ", ".join(f"{k} = ?" for k in data.keys())
    values = list(data.values()) + [id]

    conn = get_db_connection()
    conn.execute(f"UPDATE subjects SET {fields} WHERE subject_id = ?", values)
    conn.commit()
    conn.close()
    return jsonify({"message": "Subject updated"}), 200


@bp_subjects.route("/subjects/<int:id>", methods=["DELETE"])
def delete_subject(id):
    conn = get_db_connection()
    conn.execute("DELETE FROM subjects WHERE subject_id = ?", [id])
    conn.commit()
    conn.close()
    return jsonify({"message": "Subject deleted"}), 200
