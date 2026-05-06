document.addEventListener('DOMContentLoaded', function() {
	// Add Teacher Modal
	const addModal = document.getElementById('addTeacherModal');
	const addTeacherBtn = document.getElementById('addTeacherBtn');
	const addCancelBtn = document.getElementById('cancelBtn');
	const addCloseBtn = document.querySelector('#addTeacherModal .close');
	const addTeacherForm = document.getElementById('addTeacherForm');

	// Edit Teacher Modal
	const editModal = document.getElementById('editTeacherModal');
	const editCloseBtn = document.getElementById('editCloseBtn');
	const editCancelBtn = document.getElementById('editCancelBtn');
	const editTeacherForm = document.getElementById('editTeacherForm');

	// Delete Teacher Modal
	const deleteModal = document.getElementById('deleteTeacherModal');
	const deleteCloseBtn = document.getElementById('deleteCloseBtn');
	const deleteCancelBtn = document.getElementById('deleteCancelBtn');
	const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
	let teacherToDelete = null;

	// Table
	const tableBody = document.querySelector('.information-table tbody');

	// Load teachers into table
	async function loadTeachers() {
		try {
			const response = await fetch('/api/teachers');
			if (!response.ok) {
				throw new Error('Failed to fetch teachers');
			}

			const teachers = await response.json();
			tableBody.innerHTML = '';

			teachers.forEach(teacher => {
				const row = document.createElement('tr');

				row.innerHTML = `
                <td>${teacher.teacher_id}</td>
                <td>${teacher.teacher_firstName}</td>
                <td>${teacher.teacher_lastName}</td>
                <td>${teacher.teacher_email || '-'}</td>
                <td>${teacher.teacher_phone || '-'}</td>
                <td>
                    <div style="display: flex; gap: 8px;">
                        <button class="btn-small edit-btn" data-id="${teacher.teacher_id}">Edit</button>
                        <button class="btn-small btn-danger delete-btn" data-id="${teacher.teacher_id}">Delete</button>
                    </div>
                </td>
            `;

				tableBody.appendChild(row);
			});

			// Attach event listeners to Edit and Delete buttons
			attachButtonListeners();

		} catch (error) {
			console.error('Error loading teachers:', error);
			tableBody.innerHTML = `<tr><td colspan="6">Error loading teachers</td></tr>`;
		}
	}

	// Attach listeners to Edit and Delete buttons
	function attachButtonListeners() {
		document.querySelectorAll('.edit-btn').forEach(btn => {
			btn.addEventListener('click', handleEditClick);
		});

		document.querySelectorAll('.delete-btn').forEach(btn => {
			btn.addEventListener('click', handleDeleteClick);
		});
	}

	// Handle Edit button click
	async function handleEditClick(event) {
		const teacherId = event.target.getAttribute('data-id');
		
		try {
			const response = await fetch(`/api/teachers`);
			const teachers = await response.json();
			const teacher = teachers.find(t => t.teacher_id == teacherId);

			if (teacher) {
				// Populate form with teacher data
				document.getElementById('editTeacherId').value = teacher.teacher_id;
				document.getElementById('editFirstName').value = teacher.teacher_firstName;
				document.getElementById('editLastName').value = teacher.teacher_lastName;
				document.getElementById('editEmail').value = teacher.teacher_email || '';
				document.getElementById('editPhone').value = teacher.teacher_phone || '';

				// Open modal
				editModal.classList.add('show');
			}
		} catch (error) {
			console.error('Error loading teacher for edit:', error);
			alert('Failed to load teacher details');
		}
	}

	// Handle Delete button click
	async function handleDeleteClick(event) {
		const teacherId = event.target.getAttribute('data-id');
		
		try {
			const response = await fetch(`/api/teachers`);
			const teachers = await response.json();
			const teacher = teachers.find(t => t.teacher_id == teacherId);

			if (teacher) {
				teacherToDelete = teacher;
				document.getElementById('deleteTeacherId').textContent = teacher.teacher_id;
				document.getElementById('deleteTeacherName').textContent = `${teacher.teacher_firstName} ${teacher.teacher_lastName}`;
				deleteModal.classList.add('show');
			}
		} catch (error) {
			console.error('Error loading teacher for delete:', error);
			alert('Failed to load teacher details');
		}
	}

	// Open Add modal
	addTeacherBtn.addEventListener('click', function() {
		addModal.classList.add('show');
	});

	// Close Add modal
	function closeAddModal() {
		addModal.classList.remove('show');
		addTeacherForm.reset();
	}

	addCancelBtn.addEventListener('click', closeAddModal);
	addCloseBtn.addEventListener('click', closeAddModal);

	// Close Edit modal
	function closeEditModal() {
		editModal.classList.remove('show');
		editTeacherForm.reset();
	}

	editCancelBtn.addEventListener('click', closeEditModal);
	editCloseBtn.addEventListener('click', closeEditModal);

	// Close Delete modal
	function closeDeleteModal() {
		deleteModal.classList.remove('show');
		teacherToDelete = null;
	}

	deleteCancelBtn.addEventListener('click', closeDeleteModal);
	deleteCloseBtn.addEventListener('click', closeDeleteModal);

	// Close modal when clicking outside
	window.addEventListener('click', function(event) {
		if (event.target === addModal) {
			closeAddModal();
		}
		if (event.target === editModal) {
			closeEditModal();
		}
		if (event.target === deleteModal) {
			closeDeleteModal();
		}
	});

	// Handle Add form submission
	addTeacherForm.addEventListener('submit', async function(e) {
		e.preventDefault();

		const formData = {
			firstName: document.getElementById('firstName').value,
			lastName: document.getElementById('lastName').value,
			email: document.getElementById('email').value,
			phone: document.getElementById('phone').value
		};

		try {
			const response = await fetch('/api/teachers', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(formData)
			});

			if (response.ok) {
				closeAddModal();
				loadTeachers();
				alert('Teacher added successfully');
			} else {
				alert('Failed to add teacher');
			}
		} catch (error) {
			console.error('Error adding teacher:', error);
			alert('Error adding teacher');
		}
	});

	// Handle Edit form submission
	editTeacherForm.addEventListener('submit', async function(e) {
		e.preventDefault();

		const teacherId = document.getElementById('editTeacherId').value;
		const formData = {
			firstName: document.getElementById('editFirstName').value,
			lastName: document.getElementById('editLastName').value,
			email: document.getElementById('editEmail').value,
			phone: document.getElementById('editPhone').value
		};

		try {
			const response = await fetch(`/api/teachers/${teacherId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(formData)
			});

			if (response.ok) {
				closeEditModal();
				loadTeachers();
				alert('Teacher updated successfully');
			} else {
				alert('Failed to update teacher');
			}
		} catch (error) {
			console.error('Error updating teacher:', error);
			alert('Error updating teacher');
		}
	});

	// Handle Delete confirmation
	confirmDeleteBtn.addEventListener('click', async function() {
		if (!teacherToDelete) return;

		try {
			const response = await fetch(`/api/teachers/${teacherToDelete.teacher_id}`, {
				method: 'DELETE'
			});

			if (response.ok) {
				closeDeleteModal();
				loadTeachers();
				alert('Teacher deleted successfully');
			} else {
				alert('Failed to delete teacher');
			}
		} catch (error) {
			console.error('Error deleting teacher:', error);
			alert('Error deleting teacher');
		}
	});

	// Initial load
	loadTeachers();
});
