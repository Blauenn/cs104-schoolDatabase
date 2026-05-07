from flask import Blueprint, request, jsonify
import sqlite3

from backend.database import get_db_connection

bp_classes = Blueprint("classes", __name__)


@bp_classes.route("/classes", methods=["GET"])
def get_classes():
    conn = get_db_connection()
    rows = conn.execute("SELECT * FROM classes").fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])


@bp_classes.route("/classes", methods=["POST"])
def create_class():
    data = request.get_json()
    try:
        conn = get_db_connection()
        conn.execute(
            "INSERT INTO classes (class_name, class_teacher_id) VALUES (?, ?)",
            (data.get("class_name"), data.get("teacher_id")),
        )
        conn.commit()
        conn.close()
        return jsonify({"message": "Class created"}), 201
    except sqlite3.Error as e:
        return jsonify({"error": str(e)}), 400


@bp_classes.route("/classes/<int:id>", methods=["PATCH"])
def update_class(id):
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    fields = ", ".join(f"{k} = ?" for k in data.keys())
    values = list(data.values()) + [id]

    conn = get_db_connection()
    conn.execute(f"UPDATE classes SET {fields} WHERE class_id = ?", values)
    conn.commit()
    conn.close()
    return jsonify({"message": "Class updated"}), 200


@bp_classes.route("/classes/<int:id>", methods=["DELETE"])
def delete_class(id):
    conn = get_db_connection()
    conn.execute("DELETE FROM classes WHERE class_id = ?", [id])
    conn.commit()
    conn.close()
    return jsonify({"message": "Class deleted"}), 200
