document.addEventListener('DOMContentLoaded', function() {
	// Add Class Modal
	const addModal = document.getElementById('addClassModal');
	const addClassBtn = document.getElementById('addClassBtn');
	const addCancelBtn = document.getElementById('cancelBtn');
	const addCloseBtn = document.querySelector('#addClassModal .close');
	const addClassForm = document.getElementById('addClassForm');

	// Edit Class Modal
	const editModal = document.getElementById('editClassModal');
	const editCloseBtn = document.getElementById('editCloseBtn');
	const editCancelBtn = document.getElementById('editCancelBtn');
	const editClassForm = document.getElementById('editClassForm');

	// Delete Class Modal
	const deleteModal = document.getElementById('deleteClassModal');
	const deleteCloseBtn = document.getElementById('deleteCloseBtn');
	const deleteCancelBtn = document.getElementById('deleteCancelBtn');
	const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
	let classToDelete = null;

	// Table
	const tableBody = document.querySelector('.information-table tbody');

	// Load classes into table
	async function loadClasses() {
		try {
			const response = await fetch('/api/classes');
			if (!response.ok) {
				throw new Error('Failed to fetch classes');
			}

			const classes = await response.json();
			tableBody.innerHTML = '';

			classes.forEach(classItem => {
				const row = document.createElement('tr');

				row.innerHTML = `
                <td>${classItem.class_id}</td>
                <td>${classItem.class_name}</td>
                <td>${classItem.class_major || '-'}</td>
                <td>${classItem.class_department || '-'}</td>
                <td>
                    <div style="display: flex; gap: 8px;">
                        <button class="btn-small edit-btn" data-id="${classItem.class_id}">Edit</button>
                        <button class="btn-small btn-danger delete-btn" data-id="${classItem.class_id}">Delete</button>
                    </div>
                </td>
            `;

				tableBody.appendChild(row);
			});

			// Attach event listeners to Edit and Delete buttons
			attachButtonListeners();

		} catch (error) {
			console.error('Error loading classes:', error);
			tableBody.innerHTML = `<tr><td colspan="5">Error loading classes</td></tr>`;
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
		const classId = event.target.getAttribute('data-id');
		
		try {
			const response = await fetch(`/api/classes`);
			const classes = await response.json();
			const classItem = classes.find(c => c.class_id == classId);

			if (classItem) {
				// Populate form with class data
				document.getElementById('editClassId').value = classItem.class_id;
				document.getElementById('editClassName').value = classItem.class_name;
				document.getElementById('editMajor').value = classItem.class_major || '';
				document.getElementById('editDepartment').value = classItem.class_department || '';

				// Open modal
				editModal.classList.add('show');
			}
		} catch (error) {
			console.error('Error loading class for edit:', error);
			alert('Failed to load class details');
		}
	}

	// Handle Delete button click
	async function handleDeleteClick(event) {
		const classId = event.target.getAttribute('data-id');
		
		try {
			const response = await fetch(`/api/classes`);
			const classes = await response.json();
			const classItem = classes.find(c => c.class_id == classId);

			if (classItem) {
				classToDelete = classItem;
				document.getElementById('deleteClassId').textContent = classItem.class_id;
				document.getElementById('deleteClassName').textContent = classItem.class_name;
				deleteModal.classList.add('show');
			}
		} catch (error) {
			console.error('Error loading class for delete:', error);
			alert('Failed to load class details');
		}
	}

	// Open Add modal
	addClassBtn.addEventListener('click', function() {
		addModal.classList.add('show');
	});

	// Close Add modal
	function closeAddModal() {
		addModal.classList.remove('show');
		addClassForm.reset();
	}

	addCancelBtn.addEventListener('click', closeAddModal);
	addCloseBtn.addEventListener('click', closeAddModal);

	// Close Edit modal
	function closeEditModal() {
		editModal.classList.remove('show');
		editClassForm.reset();
	}

	editCancelBtn.addEventListener('click', closeEditModal);
	editCloseBtn.addEventListener('click', closeEditModal);

	// Close Delete modal
	function closeDeleteModal() {
		deleteModal.classList.remove('show');
		classToDelete = null;
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
	addClassForm.addEventListener('submit', async function(e) {
		e.preventDefault();

		const formData = {
			className: document.getElementById('className').value,
			major: document.getElementById('major').value,
			department: document.getElementById('department').value
		};

		try {
			const response = await fetch('/api/classes', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(formData)
			});

			if (response.ok) {
				closeAddModal();
				loadClasses();
				alert('Class added successfully');
			} else {
				alert('Failed to add class');
			}
		} catch (error) {
			console.error('Error adding class:', error);
			alert('Error adding class');
		}
	});

	// Handle Edit form submission
	editClassForm.addEventListener('submit', async function(e) {
		e.preventDefault();

		const classId = document.getElementById('editClassId').value;
		const formData = {
			className: document.getElementById('editClassName').value,
			major: document.getElementById('editMajor').value,
			department: document.getElementById('editDepartment').value
		};

		try {
			const response = await fetch(`/api/classes/${classId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(formData)
			});

			if (response.ok) {
				closeEditModal();
				loadClasses();
				alert('Class updated successfully');
			} else {
				alert('Failed to update class');
			}
		} catch (error) {
			console.error('Error updating class:', error);
			alert('Error updating class');
		}
	});

	// Handle Delete confirmation
	confirmDeleteBtn.addEventListener('click', async function() {
		if (!classToDelete) return;

		try {
			const response = await fetch(`/api/classes/${classToDelete.class_id}`, {
				method: 'DELETE'
			});

			if (response.ok) {
				closeDeleteModal();
				loadClasses();
				alert('Class deleted successfully');
			} else {
				alert('Failed to delete class');
			}
		} catch (error) {
			console.error('Error deleting class:', error);
			alert('Error deleting class');
		}
	});

	// Initial load
	loadClasses();
});
