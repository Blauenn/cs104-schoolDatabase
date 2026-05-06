from flask import Blueprint, request, jsonify
import sqlite3

from backend.database import get_db_connection

bp_teachers = Blueprint("teachers", __name__)


@bp_teachers.route("/teachers", methods=["GET"])
def get_teachers():
    conn = get_db_connection()
    rows = conn.execute("SELECT * FROM teachers").fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])


@bp_teachers.route("/teachers", methods=["POST"])
def create_teacher():
    data = request.get_json()
    try:
        conn = get_db_connection()
        conn.execute(
            "INSERT INTO teachers (teacher_first_name, teacher_last_name, teacher_email, teacher_phone) VALUES (?, ?, ?, ?, ?)",
            (
                data.get("first_name"),
                data.get("last_name"),
                data.get("first_name"),
                data.get("first_name"),
                data.get("first_name"),
            ),
        )
        conn.commit()
        conn.close()
        return jsonify({"message": "Teacher created"}), 201
    except sqlite3.Error as e:
        return jsonify({"error": str(e)}), 400
