from flask import Flask, render_template, request, jsonify
import sqlite3
import os

app = Flask(__name__)

# Database configuration - use absolute path for PythonAnywhere
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DATABASE = os.path.join(BASE_DIR, 'school.db')

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

# Initialize database when app starts (before first request)
init_db()

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

@app.route('/api/students')
def get_students():
  try:
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT 
            student_id,
            student_firstName,
            student_lastName,
            student_email,
            student_phone,
            student_class_id
        FROM students
        ORDER BY student_id
    ''')
    students = cursor.fetchall()
    conn.close()
    
    return jsonify([dict(row) for row in students])
  except Exception as e:
    return jsonify({'error': str(e)}), 500

@app.route('/api/classes')
def get_classes():
    """API endpoint to fetch all classes"""
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('SELECT class_id, class_name, class_major, class_department FROM classes ORDER BY class_id')
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
        cursor.execute('SELECT teacher_id, teacher_firstName, teacher_lastName, teacher_email, teacher_phone FROM teachers ORDER BY teacher_id')
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
        cursor.execute('SELECT subject_id, subject_name, subject_major, subject_department, subject_teacher_id FROM subjects ORDER BY subject_id')
        subjects = cursor.fetchall()
        conn.close()
        
        return jsonify([dict(row) for row in subjects])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/enrollments')
def get_enrollments():
    """API endpoint to fetch all enrollments"""
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('SELECT enrollment_id, enrollment_class_id, enrollment_subject_id FROM enrollments ORDER BY enrollment_id')
        enrollments = cursor.fetchall()
        conn.close()
        
        return jsonify([dict(row) for row in enrollments])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/students', methods=['POST'])
def add_student():
    """API endpoint to add a new student"""
    try:
        data = request.get_json()
        
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO students (student_firstName, student_lastName, student_email, student_phone, student_class_id)
            VALUES (?, ?, ?, ?, ?)
        ''', (data['firstName'], data['lastName'], data['email'], data['phone'], data['classId'] or None))
        
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Student added successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/students/<int:student_id>', methods=['PUT'])
def update_student(student_id):
    """API endpoint to update a student"""
    try:
        data = request.get_json()
        
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('''
            UPDATE students 
            SET student_firstName = ?, student_lastName = ?, student_email = ?, student_phone = ?, student_class_id = ?
            WHERE student_id = ?
        ''', (data['firstName'], data['lastName'], data['email'], data['phone'], data['classId'] or None, student_id))
        
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Student updated successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/students/<int:student_id>', methods=['DELETE'])
def delete_student(student_id):
    """API endpoint to delete a student"""
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('DELETE FROM students WHERE student_id = ?', (student_id,))
        
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Student deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/teachers', methods=['POST'])
def add_teacher():
    """API endpoint to add a new teacher"""
    try:
        data = request.get_json()
        
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO teachers (teacher_firstName, teacher_lastName, teacher_email, teacher_phone)
            VALUES (?, ?, ?, ?)
        ''', (data['firstName'], data['lastName'], data['email'], data['phone']))
        
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Teacher added successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/teachers/<int:teacher_id>', methods=['PUT'])
def update_teacher(teacher_id):
    """API endpoint to update a teacher"""
    try:
        data = request.get_json()
        
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('''
            UPDATE teachers 
            SET teacher_firstName = ?, teacher_lastName = ?, teacher_email = ?, teacher_phone = ?
            WHERE teacher_id = ?
        ''', (data['firstName'], data['lastName'], data['email'], data['phone'], teacher_id))
        
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Teacher updated successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/teachers/<int:teacher_id>', methods=['DELETE'])
def delete_teacher(teacher_id):
    """API endpoint to delete a teacher"""
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('DELETE FROM teachers WHERE teacher_id = ?', (teacher_id,))
        
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Teacher deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/classes', methods=['POST'])
def add_class():
    """API endpoint to add a new class"""
    try:
        data = request.get_json()
        
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO classes (class_name, class_major, class_department)
            VALUES (?, ?, ?)
        ''', (data['className'], data['major'], data['department']))
        
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Class added successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/classes/<int:class_id>', methods=['PUT'])
def update_class(class_id):
    """API endpoint to update a class"""
    try:
        data = request.get_json()
        
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('''
            UPDATE classes 
            SET class_name = ?, class_major = ?, class_department = ?
            WHERE class_id = ?
        ''', (data['className'], data['major'], data['department'], class_id))
        
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Class updated successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/classes/<int:class_id>', methods=['DELETE'])
def delete_class(class_id):
    """API endpoint to delete a class"""
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('DELETE FROM classes WHERE class_id = ?', (class_id,))
        
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Class deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/subjects', methods=['POST'])
def add_subject():
    """API endpoint to add a new subject"""
    try:
        data = request.get_json()
        
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO subjects (subject_name, subject_major, subject_department, subject_teacher_id)
            VALUES (?, ?, ?, ?)
        ''', (data['subjectName'], data['major'], data['department'], data['teacherId'] or None))
        
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Subject added successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/subjects/<int:subject_id>', methods=['PUT'])
def update_subject(subject_id):
    """API endpoint to update a subject"""
    try:
        data = request.get_json()
        
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('''
            UPDATE subjects 
            SET subject_name = ?, subject_major = ?, subject_department = ?, subject_teacher_id = ?
            WHERE subject_id = ?
        ''', (data['subjectName'], data['major'], data['department'], data['teacherId'] or None, subject_id))
        
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Subject updated successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/subjects/<int:subject_id>', methods=['DELETE'])
def delete_subject(subject_id):
    """API endpoint to delete a subject"""
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('DELETE FROM subjects WHERE subject_id = ?', (subject_id,))
        
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Subject deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/enrollments', methods=['POST'])
def add_enrollment():
    """API endpoint to add a new enrollment"""
    try:
        data = request.get_json()
        
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO enrollments (enrollment_class_id, enrollment_subject_id)
            VALUES (?, ?)
        ''', (data['classId'], data['subjectId']))
        
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Enrollment added successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/enrollments/<int:enrollment_id>', methods=['PUT'])
def update_enrollment(enrollment_id):
    """API endpoint to update an enrollment"""
    try:
        data = request.get_json()
        
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('''
            UPDATE enrollments 
            SET enrollment_class_id = ?, enrollment_subject_id = ?
            WHERE enrollment_id = ?
        ''', (data['classId'], data['subjectId'], enrollment_id))
        
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Enrollment updated successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/enrollments/<int:enrollment_id>', methods=['DELETE'])
def delete_enrollment(enrollment_id):
    """API endpoint to delete an enrollment"""
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('DELETE FROM enrollments WHERE enrollment_id = ?', (enrollment_id,))
        
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Enrollment deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=False, port=5001)
