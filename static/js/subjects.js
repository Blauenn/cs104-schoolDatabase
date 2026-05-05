document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('addSubjectModal');
    const addSubjectBtn = document.getElementById('addSubjectBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const closeBtn = document.querySelector('.close');
    const addSubjectForm = document.getElementById('addSubjectForm');
    const teacherSelect = document.getElementById('teacherId');

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

    // Open modal
    addSubjectBtn.addEventListener('click', function() {
        modal.classList.add('show');
        loadTeachers();
    });

    // Close modal
    function closeModal() {
        modal.classList.remove('show');
        addSubjectForm.reset();
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
    addSubjectForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            subjectName: document.getElementById('subjectName').value,
            major: document.getElementById('major').value,
            department: document.getElementById('department').value,
            teacherId: document.getElementById('teacherId').value
        };

        console.log('Subject data to be submitted:', formData);
        
        // TODO: Send data to backend API endpoint
        // For now, just close the modal and clear the form
        closeModal();
    });
});
