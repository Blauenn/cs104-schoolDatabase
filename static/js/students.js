document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('addStudentModal');
    const addStudentBtn = document.getElementById('addStudentBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const closeBtn = document.querySelector('.close');
    const addStudentForm = document.getElementById('addStudentForm');
    const classSelect = document.getElementById('classId');

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

    // Open modal
    addStudentBtn.addEventListener('click', function() {
        modal.classList.add('show');
        loadClasses();
    });

    // Close modal
    function closeModal() {
        modal.classList.remove('show');
        addStudentForm.reset();
    }

    cancelBtn.addEventListener('click', closeModal);
    closeBtn.addEventListener('click', closeModal);

    // Close modal when clicking outside of it
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Handle form submission
    addStudentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            classId: document.getElementById('classId').value || null
        };

        console.log('Student data to be submitted:', formData);
        
        // TODO: Send data to backend API endpoint
        // For now, just close the modal and clear the form
        closeModal();
    });
});
