from flask import Blueprint, request, jsonify
import sqlite3

from backend.database import get_db_connection

bp_students = Blueprint("students", __name__)


@bp_students.route("/students", methods=["GET"])
def get_students():
    conn = get_db_connection()
    rows = conn.execute("SELECT * FROM students").fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])


@bp_students.route("/students", methods=["POST"])
def create_student():
    data = request.get_json()
    try:
        conn = get_db_connection()
        conn.execute(
            "INSERT INTO students (student_first_name, student_last_name, student_email, student_phone, student_class_id) VALUES (?, ?, ?, ?, ?)",
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
        return jsonify({"message": "Student created"}), 201
    except sqlite3.Error as e:
        return jsonify({"error": str(e)}), 400
