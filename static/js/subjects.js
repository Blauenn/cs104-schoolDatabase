async function initSubjects() {
	const [subjectsRes, teachersRes] = await Promise.all([
		fetch('/subjects'),
		fetch('/teachers')
	]);

	const subjects = await subjectsRes.json();
	const teachers = await teachersRes.json();

	const teacherMap = {};
	teachers.forEach(t => teacherMap[t.teacher_id] = `${t.teacher_first_name} ${t.teacher_last_name}`);

	const tbody = document.getElementById('subjects-tbody');
	tbody.innerHTML = '';

	subjects.forEach((s, index) => {
		tbody.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${s.subject_code}</td>
                <td>${s.subject_name}</td>
                <td>${teacherMap[s.subject_teacher_id] || s.subject_teacher_id}</td>
                <td>
									<div style="display: flex; gap: 8px; align-items: center;">
                    <button onclick="openEditSubject(${s.subject_id}, '${s.subject_code}', '${s.subject_name}', ${s.subject_teacher_id})">Edit</button>
                    <button onclick="openDeleteSubject(${s.subject_id}, '${s.subject_name}')" class="btn-danger">Delete</button>
									</div>
                </td>
            </tr>
        `;
	});
}

// --- Add ---
async function openAddSubject() {
	const select = document.getElementById('add-subject-teacher-id');
	const response = await fetch('/teachers');
	const teachers = await response.json();

	select.innerHTML = '';
	teachers.forEach(t => {
		const option = document.createElement('option');
		option.value = t.teacher_id;
		option.textContent = `${t.teacher_id} - ${t.teacher_first_name} ${t.teacher_last_name}`;
		select.appendChild(option);
	});

	document.getElementById('add-subject-form').onsubmit = (e) => {
		e.preventDefault();
		submitAddSubject();
	};

	document.getElementById('add-subject-modal').style.display = 'flex';
}

async function submitAddSubject() {
	const data = {
		subject_code: document.getElementById('add-subject-code').value,
		subject_name: document.getElementById('add-subject-name').value,
		teacher_id: document.getElementById('add-subject-teacher-id').value,
	};

	const response = await fetch('/subjects', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data)
	});

	if (response.ok) {
		showToast('Subject added successfully.');
		closeAddSubjectModal();
		initSubjects();
	} else {
		showToast('Failed to add subject.');
	}
}

function closeAddSubjectModal() {
	document.getElementById('add-subject-modal').style.display = 'none';
	document.getElementById('add-subject-form').reset();
}

// --- Edit ---
async function openEditSubject(id, code, name, teacherId) {
	const original = { code, name, teacherId };

	document.getElementById('edit-subject-id').value = id;
	document.getElementById('edit-subject-code').value = code;
	document.getElementById('edit-subject-name').value = name;

	const select = document.getElementById('edit-subject-teacher-id');
	const response = await fetch('/teachers');
	const teachers = await response.json();

	select.innerHTML = '';
	teachers.forEach(t => {
		const option = document.createElement('option');
		option.value = t.teacher_id;
		option.textContent = `${t.teacher_id} - ${t.teacher_first_name} ${t.teacher_last_name}`;
		if (t.teacher_id === teacherId) option.selected = true;
		select.appendChild(option);
	});

	document.getElementById('edit-subject-form').onsubmit = (e) => {
		e.preventDefault();
		submitEditSubject(id, original);
	};

	document.getElementById('edit-subject-modal').style.display = 'flex';
}

async function submitEditSubject(id, original) {
	const updated = {
		subject_code: document.getElementById('edit-subject-code').value,
		subject_name: document.getElementById('edit-subject-name').value,
		teacher_id: document.getElementById('edit-subject-teacher-id').value,
	};

	const changes = {};
	if (updated.subject_code !== original.code) changes.subject_code = updated.subject_code;
	if (updated.subject_name !== original.name) changes.subject_name = updated.subject_name;
	if (updated.teacher_id != original.teacherId) changes.subject_teacher_id = updated.teacher_id;

	if (Object.keys(changes).length === 0) {
		showToast('No changes made.');
		closeEditSubjectModal();
		return;
	}

	const response = await fetch(`/subjects/${id}`, {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(changes)
	});

	if (response.ok) {
		showToast('Subject updated successfully.');
		closeEditSubjectModal();
		initSubjects();
	} else {
		showToast('Failed to update subject.');
	}
}

function closeEditSubjectModal() {
	document.getElementById('edit-subject-modal').style.display = 'none';
}

// --- Delete ---
function openDeleteSubject(id, name) {
	document.getElementById('delete-subject-name').textContent = `${id} - ${name}`;
	document.getElementById('confirm-delete-subject-btn').onclick = () => confirmDeleteSubject(id);
	document.getElementById('delete-subject-modal').style.display = 'flex';
}

async function confirmDeleteSubject(id) {
	const response = await fetch(`/subjects/${id}`, { method: 'DELETE' });

	if (response.ok) {
		showToast('Subject deleted.');
		closeDeleteSubjectModal();
		initSubjects();
	} else {
		showToast('Failed to delete subject.');
	}
}

function closeDeleteSubjectModal() {
	document.getElementById('delete-subject-modal').style.display = 'none';
}