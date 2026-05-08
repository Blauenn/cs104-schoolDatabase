async function initHome() {
	const [studentsRes, teachersRes, classesRes, subjectsRes, enrollmentsRes] = await Promise.all([
		fetch('/students'),
		fetch('/teachers'),
		fetch('/classes'),
		fetch('/subjects'),
		fetch('/enrollments')
	]);

	const students = await studentsRes.json();
	const teachers = await teachersRes.json();
	const classes = await classesRes.json();
	const subjects = await subjectsRes.json();
	const enrollments = await enrollmentsRes.json();

	// summary cards
	document.getElementById('count-students').textContent = students.length;
	document.getElementById('count-teachers').textContent = teachers.length;
	document.getElementById('count-classes').textContent = classes.length;
	document.getElementById('count-subjects').textContent = subjects.length;
	document.getElementById('count-enrollments').textContent = enrollments.length;

	// lookup maps
	const classMap = {};
	classes.forEach(c => classMap[c.class_id] = c.class_name);

	const studentMap = {};
	students.forEach(s => studentMap[s.student_id] = `${s.student_first_name} ${s.student_last_name}`);

	const subjectMap = {};
	subjects.forEach(s => subjectMap[s.subject_id] = { code: s.subject_code, name: s.subject_name });

	// teacher -> subjects map
	const teacherSubjectsMap = {};
	subjects.forEach(s => {
		if (!teacherSubjectsMap[s.subject_teacher_id]) teacherSubjectsMap[s.subject_teacher_id] = [];
		teacherSubjectsMap[s.subject_teacher_id].push(s.subject_code);
	});

	// recent students (last 5)
	const recentStudents = students.slice(-5).reverse();
	const studentsList = document.getElementById('recent-students');
	studentsList.innerHTML = '';
	recentStudents.forEach(s => {
		studentsList.innerHTML += `
            <div class="recent-item">
                <span class="recent-name">${s.student_first_name} ${s.student_last_name}</span>
                <span class="recent-detail">${classMap[s.student_class_id] || '-'} · ${s.student_email}</span>
            </div>
        `;
	});

	// recent teachers (last 5)
	const recentTeachers = teachers.slice(-5).reverse();
	const teachersList = document.getElementById('recent-teachers');
	teachersList.innerHTML = '';
	recentTeachers.forEach(t => {
		const codes = teacherSubjectsMap[t.teacher_id] || [];
		teachersList.innerHTML += `
            <div class="recent-item">
                <span class="recent-name">${t.teacher_first_name} ${t.teacher_last_name}</span>
                <span class="recent-detail">${t.teacher_email} · ${codes.length ? codes.join(', ') : 'No subjects'}</span>
            </div>
        `;
	});

	// recent enrollments (last 5)
	const recentEnrollments = enrollments.slice(-5).reverse();
	const enrollmentsList = document.getElementById('recent-enrollments');
	enrollmentsList.innerHTML = '';
	recentEnrollments.forEach(e => {
		const subject = subjectMap[e.enrollment_subject_id] || {};
		enrollmentsList.innerHTML += `
            <div class="recent-item">
                <span class="recent-name">${studentMap[e.enrollment_student_id] || '-'}</span>
                <span class="recent-detail">${subject.code || '-'} · ${subject.name || '-'}</span>
            </div>
        `;
	});
}