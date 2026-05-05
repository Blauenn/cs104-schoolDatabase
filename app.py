from flask import Flask, render_template, request, jsonify
import sqlite3
import os

app = Flask(__name__)

# Database configuration
DATABASE = 'school.db'

def get_db():
    """Get database connection"""
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initialize the database with tables"""
    if not os.path.exists(DATABASE):
        conn = get_db()
        cursor = conn.cursor()
        
        # Create students table
        cursor.execute('''
            CREATE TABLE students (
                student_id INTEGER PRIMARY KEY AUTOINCREMENT,
                student_firstName TEXT NOT NULL,
                student_lastName TEXT NOT NULL,
                student_email TEXT UNIQUE,
                student_phone TEXT UNIQUE,
                student_class_id INT,
                FOREIGN KEY (student_class_id) REFERENCES classes(class_id)
            )
        ''')
        
        # Create teachers table
        cursor.execute('''
            CREATE TABLE teachers (
                teacher_id INTEGER PRIMARY KEY AUTOINCREMENT,
                teacher_firstName TEXT NOT NULL,
                teacher_lastName TEXT NOT NULL,
                teacher_email TEXT UNIQUE,
                teacher_phone TEXT UNIQUE
            )
        ''')
        
        # Create classes table
        cursor.execute('''
            CREATE TABLE classes (
                class_id INTEGER PRIMARY KEY AUTOINCREMENT,
                class_name TEXT NOT NULL,
                class_major TEXT,
                class_department TEXT
            )
        ''')
        
        # Create subjects table
        cursor.execute('''
            CREATE TABLE subjects (
                subject_id INTEGER PRIMARY KEY AUTOINCREMENT,
                subject_name TEXT NOT NULL,
                subject_major TEXT NOT NULL,
                subject_department TEXT NOT NULL,
                subject_teacher_id INT,
                FOREIGN KEY (subject_teacher_id) REFERENCES teachers(teacher_id)
            )
        ''')
        
        # Create enrollments table
        cursor.execute('''
            CREATE TABLE enrollments (
                enrollment_id INTEGER PRIMARY KEY AUTOINCREMENT,
                enrollment_class_id INT NOT NULL,
                enrollment_subject_id INT,
                FOREIGN KEY (enrollment_class_id) REFERENCES classes(class_id),
                FOREIGN KEY (enrollment_subject_id) REFERENCES subjects(subject_id)
            )
        ''')
        
        conn.commit()
        conn.close()
        print("Database initialized successfully!")
    else:
        print("Database already exists.")

@app.route('/')
def home():
    """Home page"""
    return render_template('index.html')

@app.route('/students')
def students():
    """Students management page"""
    return render_template('students.html')

@app.route('/teachers')
def teachers():
    """Teachers management page"""
    return render_template('teachers.html')

@app.route('/classes')
def classes():
    """Classes management page"""
    return render_template('classes.html')

@app.route('/subjects')
def subjects():
    """Subjects management page"""
    return render_template('subjects.html')

@app.route('/enrollments')
def enrollments():
    """Enrollments management page"""
    return render_template('enrollments.html')

@app.route('/api/classes')
def get_classes():
    """API endpoint to fetch all classes"""
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('SELECT class_id, class_name FROM classes ORDER BY class_name')
        classes = cursor.fetchall()
        conn.close()
        
        return jsonify([dict(row) for row in classes])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/teachers')
def get_teachers():
    """API endpoint to fetch all teachers"""
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('SELECT teacher_id, teacher_firstName, teacher_lastName FROM teachers ORDER BY teacher_lastName')
        teachers = cursor.fetchall()
        conn.close()
        
        return jsonify([dict(row) for row in teachers])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/subjects')
def get_subjects():
    """API endpoint to fetch all subjects"""
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('SELECT subject_id, subject_name FROM subjects ORDER BY subject_name')
        subjects = cursor.fetchall()
        conn.close()
        
        return jsonify([dict(row) for row in subjects])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    init_db()
    app.run(debug=True)
