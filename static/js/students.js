async function initStudents() {
	const [studentsRes, classesRes] = await Promise.all([
		fetch('/students'),
		fetch('/classes')
	]);

	const students = await studentsRes.json();
	const classes = await classesRes.json();

	const classMap = {};
	classes.forEach(c => classMap[c.class_id] = c.class_name);

	const tbody = document.getElementById('students-tbody');
	tbody.innerHTML = '';

	students.forEach(s => {
		tbody.innerHTML += `
            <tr>
                <td>${s.student_id}</td>
                <td>${classMap[s.student_class_id] || s.student_class_id}</td>
                <td>${s.student_first_name}</td>
                <td>${s.student_last_name}</td>
                <td>${s.student_email}</td>
                <td>${s.student_phone}</td>
                <td>
									<div style="display: flex; gap: 8px; align-items: center;">
										<button onclick="openEditStudent(${s.student_id}, '${s.student_first_name}', '${s.student_last_name}', '${s.student_email}', '${s.student_phone}', ${s.student_class_id})">Edit</button>
										<button onclick="openDeleteStudent(${s.student_id}, '${s.student_first_name} ${s.student_last_name}')" class="btn-danger">Delete</button>
									</div>
								</td>
            </tr>
        `;
	});
}

// --- Add ---

async function openAddStudent() {
	// populate class dropdown
	const classSelect = document.getElementById('add-class-id');
	const response = await fetch('/classes');
	const classes = await response.json();

	classSelect.innerHTML = '';
	classes.forEach(c => {
		const option = document.createElement('option');
		option.value = c.class_id;
		option.textContent = `${c.class_id} - ${c.class_name}`;
		classSelect.appendChild(option);
	});

	document.getElementById('add-student-form').onsubmit = (e) => {
		e.preventDefault();
		submitAddStudent();
	};

	document.getElementById('add-student-modal').style.display = 'flex';
}

async function submitAddStudent() {
	const data = {
		first_name: document.getElementById('add-first-name').value,
		last_name: document.getElementById('add-last-name').value,
		email: document.getElementById('add-email').value,
		phone: document.getElementById('add-phone').value,
		class_id: document.getElementById('add-class-id').value,
	};

	const response = await fetch('/students', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data)
	});

	if (response.ok) {
		showToast('Student added successfully.');
		closeAddModal();
		initStudents();
	} else {
		showToast('Failed to add student.');
	}
}

function closeAddModal() {
	document.getElementById('add-student-modal').style.display = 'none';
	document.getElementById('add-student-form').reset();
}

// --- Edit ---

async function openEditStudent(id, firstName, lastName, email, phone, classId) {
	const original = { firstName, lastName, email, phone, classId };

	document.getElementById('edit-student-id').value = id;
	document.getElementById('edit-first-name').value = firstName;
	document.getElementById('edit-last-name').value = lastName;
	document.getElementById('edit-email').value = email;
	document.getElementById('edit-phone').value = phone;

	// populate class dropdown
	const classSelect = document.getElementById('edit-class-id');
	const response = await fetch('/classes');
	const classes = await response.json();

	classSelect.innerHTML = '';
	classes.forEach(c => {
		const option = document.createElement('option');
		option.value = c.class_id;
		option.textContent = `${c.class_id} - ${c.class_name}`;
		if (c.class_id === classId) option.selected = true;
		classSelect.appendChild(option);
	});

	document.getElementById('edit-student-form').onsubmit = (e) => {
		e.preventDefault();
		submitEditStudent(id, original);
	};

	document.getElementById('edit-student-modal').style.display = 'flex';
}

async function submitEditStudent(id, original) {
	const updated = {
		first_name: document.getElementById('edit-first-name').value,
		last_name: document.getElementById('edit-last-name').value,
		email: document.getElementById('edit-email').value,
		phone: document.getElementById('edit-phone').value,
		class_id: document.getElementById('edit-class-id').value,
	};

	// only send changed fields
	const changes = {};
	if (updated.first_name !== original.firstName) changes.student_first_name = updated.first_name;
	if (updated.last_name !== original.lastName) changes.student_last_name = updated.last_name;
	if (updated.email !== original.email) changes.student_email = updated.email;
	if (updated.phone !== original.phone) changes.student_phone = updated.phone;
	if (updated.class_id != original.classId) changes.student_class_id = updated.class_id;

	if (Object.keys(changes).length === 0) {
		showToast('No changes made.');
		closeEditModal();
		return;
	}

	const response = await fetch(`/students/${id}`, {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(changes)
	});

	if (response.ok) {
		showToast('Student updated successfully.');
		closeEditModal();
		initStudents();
	} else {
		showToast('Failed to update student.');
	}
}

function closeEditModal() {
	document.getElementById('edit-student-modal').style.display = 'none';
}

// --- Delete ---

function openDeleteStudent(id, name) {
	document.getElementById('delete-student-name').textContent = `${id} - ${name}`;
	document.getElementById('confirm-delete-btn').onclick = () => confirmDeleteStudent(id);
	document.getElementById('delete-student-modal').style.display = 'flex';
}

async function confirmDeleteStudent(id) {
	const response = await fetch(`/students/${id}`, { method: 'DELETE' });

	if (response.ok) {
		showToast('Student deleted.');
		closeDeleteModal();
		initStudents();
	} else {
		showToast('Failed to delete student.');
	}
}

function closeDeleteModal() {
	document.getElementById('delete-student-modal').style.display = 'none';
}


// --- Toast ---

function showToast(message) {
	const toast = document.getElementById('toast');
	toast.textContent = message;
	toast.classList.add('show');
	setTimeout(() => toast.classList.remove('show'), 3000);
}