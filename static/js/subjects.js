document.addEventListener('DOMContentLoaded', function() {
	// Add Subject Modal
	const addModal = document.getElementById('addSubjectModal');
	const addSubjectBtn = document.getElementById('addSubjectBtn');
	const addCancelBtn = document.getElementById('cancelBtn');
	const addCloseBtn = document.querySelector('#addSubjectModal .close');
	const addSubjectForm = document.getElementById('addSubjectForm');
	const teacherSelect = document.getElementById('teacherId');

	// Edit Subject Modal
	const editModal = document.getElementById('editSubjectModal');
	const editCloseBtn = document.getElementById('editCloseBtn');
	const editCancelBtn = document.getElementById('editCancelBtn');
	const editSubjectForm = document.getElementById('editSubjectForm');
	const editTeacherSelect = document.getElementById('editTeacherId');

	// Delete Subject Modal
	const deleteModal = document.getElementById('deleteSubjectModal');
	const deleteCloseBtn = document.getElementById('deleteCloseBtn');
	const deleteCancelBtn = document.getElementById('deleteCancelBtn');
	const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
	let subjectToDelete = null;

	// Table
	const tableBody = document.querySelector('.information-table tbody');

	// Load subjects into table
	async function loadSubjects() {
		try {
			const response = await fetch('/api/subjects');
			if (!response.ok) {
				throw new Error('Failed to fetch subjects');
			}

			const subjects = await response.json();
			const teachers = await fetch('/api/teachers').then(r => r.json());
			const teacherMap = {};
			teachers.forEach(t => {
				teacherMap[t.teacher_id] = `${t.teacher_firstName} ${t.teacher_lastName}`;
			});

			tableBody.innerHTML = '';

			subjects.forEach(subject => {
				const row = document.createElement('tr');

				row.innerHTML = `
                <td>${subject.subject_id}</td>
                <td>${subject.subject_name}</td>
                <td>${subject.subject_major || '-'}</td>
                <td>${subject.subject_department || '-'}</td>
                <td>${teacherMap[subject.subject_teacher_id] || '-'}</td>
                <td>
                    <div style="display: flex; gap: 8px;">
                        <button class="btn-small edit-btn" data-id="${subject.subject_id}">Edit</button>
                        <button class="btn-small btn-danger delete-btn" data-id="${subject.subject_id}">Delete</button>
                    </div>
                </td>
            `;

				tableBody.appendChild(row);
			});

			// Attach event listeners to Edit and Delete buttons
			attachButtonListeners();

		} catch (error) {
			console.error('Error loading subjects:', error);
			tableBody.innerHTML = `<tr><td colspan="6">Error loading subjects</td></tr>`;
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
		const subjectId = event.target.getAttribute('data-id');
		
		try {
			const response = await fetch(`/api/subjects`);
			const subjects = await response.json();
			const subject = subjects.find(s => s.subject_id == subjectId);

			if (subject) {
				// Populate form with subject data
				document.getElementById('editSubjectId').value = subject.subject_id;
				document.getElementById('editSubjectName').value = subject.subject_name;
				document.getElementById('editMajor').value = subject.subject_major || '';
				document.getElementById('editDepartment').value = subject.subject_department || '';
				document.getElementById('editTeacherId').value = subject.subject_teacher_id || '';

				// Load teachers
				await loadEditTeachers();

				// Open modal
				editModal.classList.add('show');
			}
		} catch (error) {
			console.error('Error loading subject for edit:', error);
			alert('Failed to load subject details');
		}
	}

	// Handle Delete button click
	async function handleDeleteClick(event) {
		const subjectId = event.target.getAttribute('data-id');
		
		try {
			const response = await fetch(`/api/subjects`);
			const subjects = await response.json();
			const subject = subjects.find(s => s.subject_id == subjectId);

			if (subject) {
				subjectToDelete = subject;
				document.getElementById('deleteSubjectId').textContent = subject.subject_id;
				document.getElementById('deleteSubjectName').textContent = subject.subject_name;
				deleteModal.classList.add('show');
			}
		} catch (error) {
			console.error('Error loading subject for delete:', error);
			alert('Failed to load subject details');
		}
	}

	// Fetch teachers and populate dropdown
	async function loadTeachers() {
		try {
			const response = await fetch('/api/teachers');
			if (!response.ok) {
				throw new Error('Failed to fetch teachers');
			}
			const teachers = await response.json();
			
			// Clear existing options except the placeholder
			teacherSelect.innerHTML = '<option value="">-- Select a Teacher --</option>';
			
			// Populate dropdown with teachers
			teachers.forEach(teacher => {
				const option = document.createElement('option');
				option.value = teacher.teacher_id;
				option.textContent = `${teacher.teacher_firstName} ${teacher.teacher_lastName}`;
				teacherSelect.appendChild(option);
			});
		} catch (error) {
			console.error('Error loading teachers:', error);
			teacherSelect.innerHTML = '<option value="">-- Error loading teachers --</option>';
		}
	}

	// Fetch teachers for edit modal
	async function loadEditTeachers() {
		try {
			const response = await fetch('/api/teachers');
			if (!response.ok) {
				throw new Error('Failed to fetch teachers');
			}
			const teachers = await response.json();
			
			// Clear existing options except the placeholder
			editTeacherSelect.innerHTML = '<option value="">-- Select a Teacher --</option>';
			
			// Populate dropdown with teachers
			teachers.forEach(teacher => {
				const option = document.createElement('option');
				option.value = teacher.teacher_id;
				option.textContent = `${teacher.teacher_firstName} ${teacher.teacher_lastName}`;
				editTeacherSelect.appendChild(option);
			});
		} catch (error) {
			console.error('Error loading teachers:', error);
			editTeacherSelect.innerHTML = '<option value="">-- Error loading teachers --</option>';
		}
	}

	// Open Add modal
	addSubjectBtn.addEventListener('click', function() {
		addModal.classList.add('show');
		loadTeachers();
	});

	// Close Add modal
	function closeAddModal() {
		addModal.classList.remove('show');
		addSubjectForm.reset();
	}

	addCancelBtn.addEventListener('click', closeAddModal);
	addCloseBtn.addEventListener('click', closeAddModal);

	// Close Edit modal
	function closeEditModal() {
		editModal.classList.remove('show');
		editSubjectForm.reset();
	}

	editCancelBtn.addEventListener('click', closeEditModal);
	editCloseBtn.addEventListener('click', closeEditModal);

	// Close Delete modal
	function closeDeleteModal() {
		deleteModal.classList.remove('show');
		subjectToDelete = null;
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
	addSubjectForm.addEventListener('submit', async function(e) {
		e.preventDefault();
		
		const formData = {
			subjectName: document.getElementById('subjectName').value,
			major: document.getElementById('major').value,
			department: document.getElementById('department').value,
			teacherId: document.getElementById('teacherId').value || null
		};

		try {
			const response = await fetch('/api/subjects', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(formData)
			});

			if (response.ok) {
				closeAddModal();
				loadSubjects();
				alert('Subject added successfully');
			} else {
				alert('Failed to add subject');
			}
		} catch (error) {
			console.error('Error adding subject:', error);
			alert('Error adding subject');
		}
	});

	// Handle Edit form submission
	editSubjectForm.addEventListener('submit', async function(e) {
		e.preventDefault();

		const subjectId = document.getElementById('editSubjectId').value;
		const formData = {
			subjectName: document.getElementById('editSubjectName').value,
			major: document.getElementById('editMajor').value,
			department: document.getElementById('editDepartment').value,
			teacherId: document.getElementById('editTeacherId').value || null
		};

		try {
			const response = await fetch(`/api/subjects/${subjectId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(formData)
			});

			if (response.ok) {
				closeEditModal();
				loadSubjects();
				alert('Subject updated successfully');
			} else {
				alert('Failed to update subject');
			}
		} catch (error) {
			console.error('Error updating subject:', error);
			alert('Error updating subject');
		}
	});

	// Handle Delete confirmation
	confirmDeleteBtn.addEventListener('click', async function() {
		if (!subjectToDelete) return;

		try {
			const response = await fetch(`/api/subjects/${subjectToDelete.subject_id}`, {
				method: 'DELETE'
			});

			if (response.ok) {
				closeDeleteModal();
				loadSubjects();
				alert('Subject deleted successfully');
			} else {
				alert('Failed to delete subject');
			}
		} catch (error) {
			console.error('Error deleting subject:', error);
			alert('Error deleting subject');
		}
	});

	// Initial load
	loadSubjects();
});
