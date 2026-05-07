async function initEnrollments() {
	const [enrollmentsRes, studentsRes, subjectsRes] = await Promise.all([
		fetch('/enrollments'),
		fetch('/students'),
		fetch('/subjects')
	]);

	const enrollments = await enrollmentsRes.json();
	const students = await studentsRes.json();
	const subjects = await subjectsRes.json();

	// build lookup maps
	const studentMap = {};
	students.forEach(s => studentMap[s.student_id] = `${s.student_first_name} ${s.student_last_name}`);

	const subjectCodeMap = {};
	subjects.forEach(s => subjectCodeMap[s.subject_id] = s.subject_code);
	const subjectNameMap = {};
	subjects.forEach(s => subjectNameMap[s.subject_id] = s.subject_name);

	const tbody = document.getElementById('enrollments-tbody');
	tbody.innerHTML = '';

	enrollments.forEach((e, index) => {
		tbody.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${studentMap[e.enrollment_student_id] || e.enrollment_student_id}</td>
                <td>${subjectCodeMap[e.enrollment_subject_id] || e.enrollment_subject_id}</td>
                <td>${subjectNameMap[e.enrollment_subject_id] || e.enrollment_subject_id}</td>
                <td>
                    <button onclick="openDeleteEnrollment(${e.enrollment_student_id}, ${e.enrollment_subject_id})" class="btn-danger">Delete</button>
                </td>
            </tr>
        `;
	});
}

// --- Add ---
async function openAddEnrollment() {
	const studentSelect = document.getElementById('add-enrollment-student-id');
	const subjectSelect = document.getElementById('add-enrollment-subject-id');

	const [studentsRes, subjectsRes] = await Promise.all([
		fetch('/students'),
		fetch('/subjects')
	]);

	const students = await studentsRes.json();
	const subjects = await subjectsRes.json();

	studentSelect.innerHTML = '';
	students.forEach(s => {
		const option = document.createElement('option');
		option.value = s.student_id;
		option.textContent = `${s.student_id} - ${s.student_first_name} ${s.student_last_name}`;
		studentSelect.appendChild(option);
	});

	subjectSelect.innerHTML = '';
	subjects.forEach(s => {
		const option = document.createElement('option');
		option.value = s.subject_id;
		option.textContent = `${s.subject_code} - ${s.subject_name}`;
		subjectSelect.appendChild(option);
	});

	document.getElementById('add-enrollment-form').onsubmit = (e) => {
		e.preventDefault();
		submitAddEnrollment();
	};

	document.getElementById('add-enrollment-modal').style.display = 'flex';
}

async function submitAddEnrollment() {
	const data = {
		student_id: document.getElementById('add-enrollment-student-id').value,
		subject_id: document.getElementById('add-enrollment-subject-id').value,
	};

	const response = await fetch('/enrollments', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data)
	});

	if (response.ok) {
		showToast('Enrollment added successfully.');
		closeAddEnrollmentModal();
		initEnrollments();
	} else {
		showToast('Failed to add enrollment.');
	}
}

function closeAddEnrollmentModal() {
	document.getElementById('add-enrollment-modal').style.display = 'none';
	document.getElementById('add-enrollment-form').reset();
}

// --- Delete ---
function openDeleteEnrollment(studentId, subjectId) {
	document.getElementById('delete-enrollment-name').textContent = `Student ${studentId} - Subject ${subjectId}`;
	document.getElementById('confirm-delete-enrollment-btn').onclick = () => confirmDeleteEnrollment(studentId, subjectId);
	document.getElementById('delete-enrollment-modal').style.display = 'flex';
}

async function confirmDeleteEnrollment(studentId, subjectId) {
	const response = await fetch(`/enrollments/${studentId}/${subjectId}`, { method: 'DELETE' });

	if (response.ok) {
		showToast('Enrollment deleted.');
		closeDeleteEnrollmentModal();
		initEnrollments();
	} else {
		showToast('Failed to delete enrollment.');
	}
}

function closeDeleteEnrollmentModal() {
	document.getElementById('delete-enrollment-modal').style.display = 'none';
}