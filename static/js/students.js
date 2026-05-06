document.addEventListener('DOMContentLoaded', function () {
	// Add Student Modal
	const addModal = document.getElementById('addStudentModal');
	const addStudentBtn = document.getElementById('addStudentBtn');
	const addCancelBtn = document.getElementById('cancelBtn');
	const addCloseBtn = document.querySelector('#addStudentModal .close');
	const addStudentForm = document.getElementById('addStudentForm');
	const classSelect = document.getElementById('classId');

	// Edit Student Modal
	const editModal = document.getElementById('editStudentModal');
	const editCloseBtn = document.getElementById('editCloseBtn');
	const editCancelBtn = document.getElementById('editCancelBtn');
	const editStudentForm = document.getElementById('editStudentForm');
	const editClassSelect = document.getElementById('editClassId');

	// Delete Student Modal
	const deleteModal = document.getElementById('deleteStudentModal');
	const deleteCloseBtn = document.getElementById('deleteCloseBtn');
	const deleteCancelBtn = document.getElementById('deleteCancelBtn');
	const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
	let studentToDelete = null;

	// Table
	const tableBody = document.querySelector('.information-table tbody');

	// Load students into table
	async function loadStudents() {
		try {
			const response = await fetch('/api/students');
			if (!response.ok) {
				throw new Error('Failed to fetch students');
			}

			const students = await response.json();
			tableBody.innerHTML = '';

			students.forEach(student => {
				const row = document.createElement('tr');

				row.innerHTML = `
                <td>${student.student_id}</td>
                <td>${student.student_firstName}</td>
                <td>${student.student_lastName}</td>
                <td>${student.student_email || '-'}</td>
                <td>${student.student_phone || '-'}</td>
                <td>${student.student_class_id || '-'}</td>
                <td>
                    <div style="display: flex; gap: 8px;">
                        <button class="btn-small edit-btn" data-id="${student.student_id}">Edit</button>
                        <button class="btn-small btn-danger delete-btn" data-id="${student.student_id}">Delete</button>
                    </div>
                </td>
            `;

				tableBody.appendChild(row);
			});

			// Attach event listeners to Edit and Delete buttons
			attachButtonListeners();

		} catch (error) {
			console.error('Error loading students:', error);
			tableBody.innerHTML = `<tr><td colspan="7">Error loading students</td></tr>`;
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
		const studentId = event.target.getAttribute('data-id');
		
		try {
			const response = await fetch(`/api/students`);
			const students = await response.json();
			const student = students.find(s => s.student_id == studentId);

			if (student) {
				// Populate form with student data
				document.getElementById('editStudentId').value = student.student_id;
				document.getElementById('editFirstName').value = student.student_firstName;
				document.getElementById('editLastName').value = student.student_lastName;
				document.getElementById('editEmail').value = student.student_email || '';
				document.getElementById('editPhone').value = student.student_phone || '';
				document.getElementById('editClassId').value = student.student_class_id || '';

				// Load classes
				await loadEditClasses();

				// Open modal
				editModal.classList.add('show');
			}
		} catch (error) {
			console.error('Error loading student for edit:', error);
			alert('Failed to load student details');
		}
	}

	// Handle Delete button click
	async function handleDeleteClick(event) {
		const studentId = event.target.getAttribute('data-id');
		
		try {
			const response = await fetch(`/api/students`);
			const students = await response.json();
			const student = students.find(s => s.student_id == studentId);

			if (student) {
				studentToDelete = student;
				document.getElementById('deleteStudentId').textContent = student.student_id;
				document.getElementById('deleteStudentName').textContent = `${student.student_firstName} ${student.student_lastName}`;
				deleteModal.classList.add('show');
			}
		} catch (error) {
			console.error('Error loading student for delete:', error);
			alert('Failed to load student details');
		}
	}

	// Fetch classes and populate dropdown
	async function loadClasses() {
		try {
			const response = await fetch('/api/classes');
			if (!response.ok) {
				throw new Error('Failed to fetch classes');
			}
			const classes = await response.json();

			classSelect.innerHTML = '<option value="">-- Select a Class --</option>';

			classes.forEach(classItem => {
				const option = document.createElement('option');
				option.value = classItem.class_id;
				option.textContent = classItem.class_name;
				classSelect.appendChild(option);
			});
		} catch (error) {
			console.error('Error loading classes:', error);
			classSelect.innerHTML = '<option value="">-- Error loading classes --</option>';
		}
	}

	// Fetch classes for edit modal
	async function loadEditClasses() {
		try {
			const response = await fetch('/api/classes');
			if (!response.ok) {
				throw new Error('Failed to fetch classes');
			}
			const classes = await response.json();

			editClassSelect.innerHTML = '<option value="">-- Select a Class --</option>';

			classes.forEach(classItem => {
				const option = document.createElement('option');
				option.value = classItem.class_id;
				option.textContent = classItem.class_name;
				editClassSelect.appendChild(option);
			});
		} catch (error) {
			console.error('Error loading classes:', error);
			editClassSelect.innerHTML = '<option value="">-- Error loading classes --</option>';
		}
	}

	// Open Add modal
	addStudentBtn.addEventListener('click', function () {
		addModal.classList.add('show');
		loadClasses();
	});

	// Close Add modal
	function closeAddModal() {
		addModal.classList.remove('show');
		addStudentForm.reset();
	}

	addCancelBtn.addEventListener('click', closeAddModal);
	addCloseBtn.addEventListener('click', closeAddModal);

	// Close Edit modal
	function closeEditModal() {
		editModal.classList.remove('show');
		editStudentForm.reset();
	}

	editCancelBtn.addEventListener('click', closeEditModal);
	editCloseBtn.addEventListener('click', closeEditModal);

	// Close Delete modal
	function closeDeleteModal() {
		deleteModal.classList.remove('show');
		studentToDelete = null;
	}

	deleteCancelBtn.addEventListener('click', closeDeleteModal);
	deleteCloseBtn.addEventListener('click', closeDeleteModal);

	// Close modal when clicking outside
	window.addEventListener('click', function (event) {
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
	addStudentForm.addEventListener('submit', async function (e) {
		e.preventDefault();

		const formData = {
			firstName: document.getElementById('firstName').value,
			lastName: document.getElementById('lastName').value,
			email: document.getElementById('email').value,
			phone: document.getElementById('phone').value,
			classId: document.getElementById('classId').value || null
		};

		try {
			const response = await fetch('/api/students', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(formData)
			});

			if (response.ok) {
				closeAddModal();
				loadStudents();
				alert('Student added successfully');
			} else {
				alert('Failed to add student');
			}
		} catch (error) {
			console.error('Error adding student:', error);
			alert('Error adding student');
		}
	});

	// Handle Edit form submission
	editStudentForm.addEventListener('submit', async function (e) {
		e.preventDefault();

		const studentId = document.getElementById('editStudentId').value;
		const formData = {
			firstName: document.getElementById('editFirstName').value,
			lastName: document.getElementById('editLastName').value,
			email: document.getElementById('editEmail').value,
			phone: document.getElementById('editPhone').value,
			classId: document.getElementById('editClassId').value || null
		};

		try {
			const response = await fetch(`/api/students/${studentId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(formData)
			});

			if (response.ok) {
				closeEditModal();
				loadStudents();
				alert('Student updated successfully');
			} else {
				alert('Failed to update student');
			}
		} catch (error) {
			console.error('Error updating student:', error);
			alert('Error updating student');
		}
	});

	// Handle Delete confirmation
	confirmDeleteBtn.addEventListener('click', async function () {
		if (!studentToDelete) return;

		try {
			const response = await fetch(`/api/students/${studentToDelete.student_id}`, {
				method: 'DELETE'
			});

			if (response.ok) {
				closeDeleteModal();
				loadStudents();
				alert('Student deleted successfully');
			} else {
				alert('Failed to delete student');
			}
		} catch (error) {
			console.error('Error deleting student:', error);
			alert('Error deleting student');
		}
	});

	// Initial load
	loadStudents();
});
