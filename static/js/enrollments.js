document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('addEnrollmentModal');
    const addEnrollmentBtn = document.getElementById('addEnrollmentBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const closeBtn = document.querySelector('.close');
    const addEnrollmentForm = document.getElementById('addEnrollmentForm');
    const classSelect = document.getElementById('classId');
    const subjectSelect = document.getElementById('subjectId');

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

    // Open modal
    addEnrollmentBtn.addEventListener('click', function() {
        modal.classList.add('show');
        loadClasses();
        loadSubjects();
    });

    // Close modal
    function closeModal() {
        modal.classList.remove('show');
        addEnrollmentForm.reset();
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
    addEnrollmentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            classId: document.getElementById('classId').value,
            subjectId: document.getElementById('subjectId').value
        };

        console.log('Enrollment data to be submitted:', formData);
        
        // TODO: Send data to backend API endpoint
        // For now, just close the modal and clear the form
        closeModal();
    });
});
