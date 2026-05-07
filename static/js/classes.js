async function initClasses() {
	const [classesRes, teachersRes] = await Promise.all([
		fetch('/classes'),
		fetch('/teachers')
	])

	const classes = await classesRes.json();
	const teachers = await teachersRes.json();

	const teacherMap = {};
	teachers.forEach(t => teacherMap[t.teacher_id] = `${t.teacher_first_name} ${t.teacher_last_name}`);

	const tbody = document.getElementById('classes-tbody');
	tbody.innerHTML = '';

	classes.forEach((c, index) => {
		tbody.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${c.class_name}</td>
                <td>${teacherMap[c.class_teacher_id] || c.class_teacher_id}</td>
                <td>
                    <button onclick="openEditClass(${c.class_id}, '${c.class_name}', ${c.class_teacher_id})">Edit</button>
                    <button onclick="openDeleteClass(${c.class_id}, '${c.class_name}')" class="btn-danger">Delete</button>
                </td>
            </tr>
        `;
	});
}

// --- Add ---
async function openAddClass() {
	const select = document.getElementById('add-class-teacher-id');
	const response = await fetch('/teachers');
	const teachers = await response.json();

	select.innerHTML = '';
	teachers.forEach(t => {
		const option = document.createElement('option');
		option.value = t.teacher_id;
		option.textContent = `${t.teacher_id} - ${t.teacher_first_name} ${t.teacher_last_name}`;
		select.appendChild(option);
	});

	document.getElementById('add-class-form').onsubmit = (e) => {
		e.preventDefault();
		submitAddClass();
	};

	document.getElementById('add-class-modal').style.display = 'flex';
}

async function submitAddClass() {
	const data = {
		class_name: document.getElementById('add-class-name').value,
		teacher_id: document.getElementById('add-class-teacher-id').value,
	};

	const response = await fetch('/classes', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data)
	});

	if (response.ok) {
		showToast('Class added successfully.');
		closeAddClassModal();
		initClasses();
	} else {
		showToast('Failed to add class.');
	}
}

function closeAddClassModal() {
	document.getElementById('add-class-modal').style.display = 'none';
	document.getElementById('add-class-form').reset();
}

// --- Edit ---
async function openEditClass(id, className, teacherId) {
	const original = { className, teacherId };

	document.getElementById('edit-class-id').value = id;
	document.getElementById('edit-class-name').value = className;

	const select = document.getElementById('edit-class-teacher-id');
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

	document.getElementById('edit-class-form').onsubmit = (e) => {
		e.preventDefault();
		submitEditClass(id, original);
	};

	document.getElementById('edit-class-modal').style.display = 'flex';
}

async function submitEditClass(id, original) {
	const updated = {
		class_name: document.getElementById('edit-class-name').value,
		teacher_id: document.getElementById('edit-class-teacher-id').value,
	};

	const changes = {};
	if (updated.class_name !== original.className) changes.class_name = updated.class_name;
	if (updated.teacher_id != original.teacherId) changes.class_teacher_id = updated.teacher_id;

	if (Object.keys(changes).length === 0) {
		showToast('No changes made.');
		closeEditClassModal();
		return;
	}

	const response = await fetch(`/classes/${id}`, {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(changes)
	});

	if (response.ok) {
		showToast('Class updated successfully.');
		closeEditClassModal();
		initClasses();
	} else {
		showToast('Failed to update class.');
	}
}

function closeEditClassModal() {
	document.getElementById('edit-class-modal').style.display = 'none';
}

// --- Delete ---
function openDeleteClass(id, name) {
	document.getElementById('delete-class-name').textContent = `${id} - ${name}`;
	document.getElementById('confirm-delete-class-btn').onclick = () => confirmDeleteClass(id);
	document.getElementById('delete-class-modal').style.display = 'flex';
}

async function confirmDeleteClass(id) {
	const response = await fetch(`/classes/${id}`, { method: 'DELETE' });

	if (response.ok) {
		showToast('Class deleted.');
		closeDeleteClassModal();
		initClasses();
	} else {
		showToast('Failed to delete class.');
	}
}

function closeDeleteClassModal() {
	document.getElementById('delete-class-modal').style.display = 'none';
}