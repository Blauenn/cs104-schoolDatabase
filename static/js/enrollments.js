document.addEventListener('DOMContentLoaded', function() {
	// Add Enrollment Modal
	const addModal = document.getElementById('addEnrollmentModal');
	const addEnrollmentBtn = document.getElementById('addEnrollmentBtn');
	const addCancelBtn = document.getElementById('cancelBtn');
	const addCloseBtn = document.querySelector('#addEnrollmentModal .close');
	const addEnrollmentForm = document.getElementById('addEnrollmentForm');
	const classSelect = document.getElementById('classId');
	const subjectSelect = document.getElementById('subjectId');

	// Edit Enrollment Modal
	const editModal = document.getElementById('editEnrollmentModal');
	const editCloseBtn = document.getElementById('editCloseBtn');
	const editCancelBtn = document.getElementById('editCancelBtn');
	const editEnrollmentForm = document.getElementById('editEnrollmentForm');
	const editClassSelect = document.getElementById('editClassId');
	const editSubjectSelect = document.getElementById('editSubjectId');

	// Delete Enrollment Modal
	const deleteModal = document.getElementById('deleteEnrollmentModal');
	const deleteCloseBtn = document.getElementById('deleteCloseBtn');
	const deleteCancelBtn = document.getElementById('deleteCancelBtn');
	const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
	let enrollmentToDelete = null;

	// Table
	const tableBody = document.querySelector('.information-table tbody');

	// Load enrollments into table
	async function loadEnrollments() {
		try {
			const response = await fetch('/api/enrollments');
			if (!response.ok) {
				throw new Error('Failed to fetch enrollments');
			}

			const enrollments = await response.json();
			const classes = await fetch('/api/classes').then(r => r.json());
			const subjects = await fetch('/api/subjects').then(r => r.json());

			const classMap = {};
			const subjectMap = {};
			
			classes.forEach(c => {
				classMap[c.class_id] = c.class_name;
			});
			subjects.forEach(s => {
				subjectMap[s.subject_id] = s.subject_name;
			});

			tableBody.innerHTML = '';

			enrollments.forEach(enrollment => {
				const row = document.createElement('tr');

				row.innerHTML = `
                <td>${enrollment.enrollment_id}</td>
                <td>${classMap[enrollment.enrollment_class_id] || '-'}</td>
                <td>${subjectMap[enrollment.enrollment_subject_id] || '-'}</td>
                <td>
                    <div style="display: flex; gap: 8px;">
                        <button class="btn-small edit-btn" data-id="${enrollment.enrollment_id}">Edit</button>
                        <button class="btn-small btn-danger delete-btn" data-id="${enrollment.enrollment_id}">Delete</button>
                    </div>
                </td>
            `;

				tableBody.appendChild(row);
			});

			// Attach event listeners to Edit and Delete buttons
			attachButtonListeners();

		} catch (error) {
			console.error('Error loading enrollments:', error);
			tableBody.innerHTML = `<tr><td colspan="4">Error loading enrollments</td></tr>`;
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
		const enrollmentId = event.target.getAttribute('data-id');
		
		try {
			const response = await fetch(`/api/enrollments`);
			const enrollments = await response.json();
			const enrollment = enrollments.find(e => e.enrollment_id == enrollmentId);

			if (enrollment) {
				// Populate form with enrollment data
				document.getElementById('editEnrollmentId').value = enrollment.enrollment_id;
				document.getElementById('editClassId').value = enrollment.enrollment_class_id || '';
				document.getElementById('editSubjectId').value = enrollment.enrollment_subject_id || '';

				// Load classes and subjects
				await loadEditClasses();
				await loadEditSubjects();

				// Open modal
				editModal.classList.add('show');
			}
		} catch (error) {
			console.error('Error loading enrollment for edit:', error);
			alert('Failed to load enrollment details');
		}
	}

	// Handle Delete button click
	async function handleDeleteClick(event) {
		const enrollmentId = event.target.getAttribute('data-id');
		
		try {
			const response = await fetch(`/api/enrollments`);
			const enrollments = await response.json();
			const enrollment = enrollments.find(e => e.enrollment_id == enrollmentId);

			const classes = await fetch('/api/classes').then(r => r.json());
			const subjects = await fetch('/api/subjects').then(r => r.json());

			const classMap = {};
			const subjectMap = {};
			
			classes.forEach(c => {
				classMap[c.class_id] = c.class_name;
			});
			subjects.forEach(s => {
				subjectMap[s.subject_id] = s.subject_name;
			});

			if (enrollment) {
				enrollmentToDelete = enrollment;
				document.getElementById('deleteEnrollmentId').textContent = enrollment.enrollment_id;
				document.getElementById('deleteEnrollmentClass').textContent = classMap[enrollment.enrollment_class_id] || '-';
				document.getElementById('deleteEnrollmentSubject').textContent = subjectMap[enrollment.enrollment_subject_id] || '-';
				deleteModal.classList.add('show');
			}
		} catch (error) {
			console.error('Error loading enrollment for delete:', error);
			alert('Failed to load enrollment details');
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
			
			// Clear existing options except the placeholder
			classSelect.innerHTML = '<option value="">-- Select a Class --</option>';
			
			// Populate dropdown with classes
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

	// Fetch subjects and populate dropdown
	async function loadSubjects() {
		try {
			const response = await fetch('/api/subjects');
			if (!response.ok) {
				throw new Error('Failed to fetch subjects');
			}
			const subjects = await response.json();
			
			// Clear existing options except the placeholder
			subjectSelect.innerHTML = '<option value="">-- Select a Subject --</option>';
			
			// Populate dropdown with subjects
			subjects.forEach(subject => {
				const option = document.createElement('option');
				option.value = subject.subject_id;
				option.textContent = subject.subject_name;
				subjectSelect.appendChild(option);
			});
		} catch (error) {
			console.error('Error loading subjects:', error);
			subjectSelect.innerHTML = '<option value="">-- Error loading subjects --</option>';
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
			
			// Clear existing options except the placeholder
			editClassSelect.innerHTML = '<option value="">-- Select a Class --</option>';
			
			// Populate dropdown with classes
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

	// Fetch subjects for edit modal
	async function loadEditSubjects() {
		try {
			const response = await fetch('/api/subjects');
			if (!response.ok) {
				throw new Error('Failed to fetch subjects');
			}
			const subjects = await response.json();
			
			// Clear existing options except the placeholder
			editSubjectSelect.innerHTML = '<option value="">-- Select a Subject --</option>';
			
			// Populate dropdown with subjects
			subjects.forEach(subject => {
				const option = document.createElement('option');
				option.value = subject.subject_id;
				option.textContent = subject.subject_name;
				editSubjectSelect.appendChild(option);
			});
		} catch (error) {
			console.error('Error loading subjects:', error);
			editSubjectSelect.innerHTML = '<option value="">-- Error loading subjects --</option>';
		}
	}

	// Open Add modal
	addEnrollmentBtn.addEventListener('click', function() {
		addModal.classList.add('show');
		loadClasses();
		loadSubjects();
	});

	// Close Add modal
	function closeAddModal() {
		addModal.classList.remove('show');
		addEnrollmentForm.reset();
	}

	addCancelBtn.addEventListener('click', closeAddModal);
	addCloseBtn.addEventListener('click', closeAddModal);

	// Close Edit modal
	function closeEditModal() {
		editModal.classList.remove('show');
		editEnrollmentForm.reset();
	}

	editCancelBtn.addEventListener('click', closeEditModal);
	editCloseBtn.addEventListener('click', closeEditModal);

	// Close Delete modal
	function closeDeleteModal() {
		deleteModal.classList.remove('show');
		enrollmentToDelete = null;
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
	addEnrollmentForm.addEventListener('submit', async function(e) {
		e.preventDefault();
		
		const formData = {
			classId: document.getElementById('classId').value,
			subjectId: document.getElementById('subjectId').value
		};

		try {
			const response = await fetch('/api/enrollments', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(formData)
			});

			if (response.ok) {
				closeAddModal();
				loadEnrollments();
				alert('Enrollment added successfully');
			} else {
				alert('Failed to add enrollment');
			}
		} catch (error) {
			console.error('Error adding enrollment:', error);
			alert('Error adding enrollment');
		}
	});

	// Handle Edit form submission
	editEnrollmentForm.addEventListener('submit', async function(e) {
		e.preventDefault();

		const enrollmentId = document.getElementById('editEnrollmentId').value;
		const formData = {
			classId: document.getElementById('editClassId').value,
			subjectId: document.getElementById('editSubjectId').value
		};

		try {
			const response = await fetch(`/api/enrollments/${enrollmentId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(formData)
			});

			if (response.ok) {
				closeEditModal();
				loadEnrollments();
				alert('Enrollment updated successfully');
			} else {
				alert('Failed to update enrollment');
			}
		} catch (error) {
			console.error('Error updating enrollment:', error);
			alert('Error updating enrollment');
		}
	});

	// Handle Delete confirmation
	confirmDeleteBtn.addEventListener('click', async function() {
		if (!enrollmentToDelete) return;

		try {
			const response = await fetch(`/api/enrollments/${enrollmentToDelete.enrollment_id}`, {
				method: 'DELETE'
			});

			if (response.ok) {
				closeDeleteModal();
				loadEnrollments();
				alert('Enrollment deleted successfully');
			} else {
				alert('Failed to delete enrollment');
			}
		} catch (error) {
			console.error('Error deleting enrollment:', error);
			alert('Error deleting enrollment');
		}
	});

	// Initial load
	loadEnrollments();
});
