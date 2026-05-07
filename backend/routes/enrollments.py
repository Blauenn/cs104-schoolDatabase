from flask import Blueprint, request, jsonify
import sqlite3
from backend.database import get_db_connection

bp_enrollments = Blueprint("enrollments", __name__)


@bp_enrollments.route("/enrollments", methods=["GET"])
def get_enrollments():
    conn = get_db_connection()
    rows = conn.execute("SELECT * FROM enrollments").fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])


@bp_enrollments.route("/enrollments", methods=["POST"])
def create_enrollment():
    data = request.get_json()
    try:
        conn = get_db_connection()
        conn.execute(
            "INSERT INTO enrollments (enrollment_student_id, enrollment_subject_id) VALUES (?, ?)",
            (data.get("student_id"), data.get("subject_id")),
        )
        conn.commit()
        conn.close()
        return jsonify({"message": "Enrollment created"}), 201
    except sqlite3.IntegrityError:
        return jsonify({"error": "Student is already enrolled in this subject"}), 409
    except sqlite3.Error as e:
        return jsonify({"error": str(e)}), 400


@bp_enrollments.route(
    "/enrollments/<int:student_id>/<int:subject_id>", methods=["DELETE"]
)
def delete_enrollment(student_id, subject_id):
    conn = get_db_connection()
    conn.execute(
        "DELETE FROM enrollments WHERE enrollment_student_id = ? AND enrollment_subject_id = ?",
        [student_id, subject_id],
    )
    conn.commit()
    conn.close()
    return jsonify({"message": "Enrollment deleted"}), 200
