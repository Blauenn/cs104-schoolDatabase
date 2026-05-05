document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('addTeacherModal');
    const addTeacherBtn = document.getElementById('addTeacherBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const closeBtn = document.querySelector('.close');
    const addTeacherForm = document.getElementById('addTeacherForm');

    // Open modal
    addTeacherBtn.addEventListener('click', function() {
        modal.classList.add('show');
    });

    // Close modal
    function closeModal() {
        modal.classList.remove('show');
        addTeacherForm.reset();
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
    addTeacherForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value
        };

        console.log('Teacher data to be submitted:', formData);
        
        // TODO: Send data to backend API endpoint
        // For now, just close the modal and clear the form
        closeModal();
    });
});
