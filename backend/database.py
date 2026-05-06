import sqlite3
import os

DATABASE = "database.db"


def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.executescript("""
        PRAGMA foreign_keys = ON;
 
        CREATE TABLE IF NOT EXISTS teachers (
            teacher_id          INTEGER PRIMARY KEY AUTOINCREMENT,
            teacher_first_name  VARCHAR,
            teacher_last_name   VARCHAR,
            teacher_email       VARCHAR,
            teacher_phone       VARCHAR
        );
 
        CREATE TABLE IF NOT EXISTS classes (
            class_id            INTEGER PRIMARY KEY AUTOINCREMENT,
            class_name          VARCHAR,
            class_teacher_id    INTEGER,
            FOREIGN KEY (class_teacher_id) REFERENCES teachers (teacher_id)
        );
 
        CREATE TABLE IF NOT EXISTS subjects (
            subject_id          INTEGER PRIMARY KEY AUTOINCREMENT,
            subject_code        VARCHAR,
            subject_name        VARCHAR,
            subject_teacher_id  INTEGER,
            FOREIGN KEY (subject_teacher_id) REFERENCES teachers (teacher_id)
        );
 
        CREATE TABLE IF NOT EXISTS students (
            student_id          INTEGER PRIMARY KEY AUTOINCREMENT,
            student_first_name  VARCHAR,
            student_last_name   VARCHAR,
            student_email       VARCHAR,
            student_phone       VARCHAR,
            student_class_id    INTEGER,
            FOREIGN KEY (student_class_id) REFERENCES classes (class_id)
        );
 
        CREATE TABLE IF NOT EXISTS enrollments (
            enrollment_student_id   INTEGER,
            enrollment_subject_id   INTEGER,
            PRIMARY KEY (enrollment_student_id, enrollment_subject_id),
            FOREIGN KEY (enrollment_student_id) REFERENCES students (student_id),
            FOREIGN KEY (enrollment_subject_id) REFERENCES subjects (subject_id)
        );
    """)

    conn.commit()
    conn.close()
    print(f"Database initialized at {os.path.abspath(DATABASE)}")
