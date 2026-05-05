CREATE TABLE students (
	student_id INTEGER PRIMARY KEY AUTOINCREMENT,
	student_firstName TEXT NOT NULL,
	student_lastName TEXT NOT NULL,
	student_email TEXT UNIQUE,
	student_phone TEXT UNIQUE,
	student_class_id INT,
	FOREIGN KEY (student_class_id) REFERENCES classes(class_id)
)

CREATE TABLE teachers (
  teacher_id INTEGER PRIMARY KEY AUTOINCREMENT,
  teacher_firstName TEXT NOT NULL,
  teacher_lastName TEXT NOT NULL,
  teacher_email TEXT UNIQUE,
  teacher_phone TEXT UNIQUE
)

CREATE TABLE classes (
  class_id INTEGER PRIMARY KEY AUTOINCREMENT,
  class_name TEXT NOT NULL,
  class_major TEXT,
  class_department TEXT
)

CREATE TABLE subjects (
  subject_id INTEGER PRIMARY KEY AUTOINCREMENT,
  subject_name TEXT NOT NULL,
  subject_major TEXT NOT NULL,
  subject_department TEXT NOT NULL,
  subject_teacher_id INT,
  FOREIGN KEY (subject_teacher_id) REFERENCES teachers(teacher_id)
)

CREATE TABLE enrollments (
  enrollment_id INTEGER PRIMARY KEY AUTOINCREMENT,
  enrollment_class_id INT NOT NULL,
  enrollment_subject_id INT,
  FOREIGN KEY (enrollment_class_id) REFERENCES classes(class_id),
  FOREIGN KEY (enrollment_subject_id) REFERENCES subjects(subject_id)
)