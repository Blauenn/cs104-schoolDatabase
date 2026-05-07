async function initTeachers() {
	const response = await fetch('/teachers');
	const teachers = await response.json();

	const tbody = document.getElementById('teachers-tbody');
	tbody.innerHTML = '';

	teachers.forEach((t, index) => {
		tbody.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${t.teacher_first_name}</td>
                <td>${t.teacher_last_name}</td>
                <td>${t.teacher_email}</td>
                <td>${t.teacher_phone}</td>
                <td>
                    <button onclick="openEditTeacher(${t.teacher_id}, '${t.teacher_first_name}', '${t.teacher_last_name}', '${t.teacher_email}', '${t.teacher_phone}')">Edit</button>
                    <button onclick="openDeleteTeacher(${t.teacher_id}, '${t.teacher_first_name} ${t.teacher_last_name}')" class="btn-danger">Delete</button>
                </td>
            </tr>
        `;
	});
}

// --- Add ---
async function openAddTeacher() {
	document.getElementById('add-teacher-form').onsubmit = (e) => {
		e.preventDefault();
		submitAddTeacher();
	};
	document.getElementById('add-teacher-modal').style.display = 'flex';
}

async function submitAddTeacher() {
	const data = {
		first_name: document.getElementById('add-teacher-first-name').value,
		last_name: document.getElementById('add-teacher-last-name').value,
		email: document.getElementById('add-teacher-email').value,
		phone: document.getElementById('add-teacher-phone').value,
	};

	const response = await fetch('/teachers', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data)
	});

	if (response.ok) {
		showToast('Teacher added successfully.');
		closeAddTeacherModal();
		initTeachers();
	} else {
		showToast('Failed to add teacher.');
	}
}

function closeAddTeacherModal() {
	document.getElementById('add-teacher-modal').style.display = 'none';
	document.getElementById('add-teacher-form').reset();
}

// --- Edit ---
function openEditTeacher(id, firstName, lastName, email, phone) {
	const original = { firstName, lastName, email, phone };

	document.getElementById('edit-teacher-id').value = id;
	document.getElementById('edit-teacher-first-name').value = firstName;
	document.getElementById('edit-teacher-last-name').value = lastName;
	document.getElementById('edit-teacher-email').value = email;
	document.getElementById('edit-teacher-phone').value = phone;

	document.getElementById('edit-teacher-form').onsubmit = (e) => {
		e.preventDefault();
		submitEditTeacher(id, original);
	};

	document.getElementById('edit-teacher-modal').style.display = 'flex';
}

async function submitEditTeacher(id, original) {
	const updated = {
		first_name: document.getElementById('edit-teacher-first-name').value,
		last_name: document.getElementById('edit-teacher-last-name').value,
		email: document.getElementById('edit-teacher-email').value,
		phone: document.getElementById('edit-teacher-phone').value,
	};

	const changes = {};
	if (updated.first_name !== original.firstName) changes.teacher_first_name = updated.first_name;
	if (updated.last_name !== original.lastName) changes.teacher_last_name = updated.last_name;
	if (updated.email !== original.email) changes.teacher_email = updated.email;
	if (updated.phone !== original.phone) changes.teacher_phone = updated.phone;

	if (Object.keys(changes).length === 0) {
		showToast('No changes made.');
		closeEditTeacherModal();
		return;
	}

	const response = await fetch(`/teachers/${id}`, {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(changes)
	});

	if (response.ok) {
		showToast('Teacher updated successfully.');
		closeEditTeacherModal();
		initTeachers();
	} else {
		showToast('Failed to update teacher.');
	}
}

function closeEditTeacherModal() {
	document.getElementById('edit-teacher-modal').style.display = 'none';
}

// --- Delete ---
function openDeleteTeacher(id, name) {
	document.getElementById('delete-teacher-name').textContent = `${id} - ${name}`;
	document.getElementById('confirm-delete-teacher-btn').onclick = () => confirmDeleteTeacher(id);
	document.getElementById('delete-teacher-modal').style.display = 'flex';
}

async function confirmDeleteTeacher(id) {
	const response = await fetch(`/teachers/${id}`, { method: 'DELETE' });

	if (response.ok) {
		showToast('Teacher deleted.');
		closeDeleteTeacherModal();
		initTeachers();
	} else {
		showToast('Failed to delete teacher.');
	}
}

function closeDeleteTeacherModal() {
	document.getElementById('delete-teacher-modal').style.display = 'none';
}