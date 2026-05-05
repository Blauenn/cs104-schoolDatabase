document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('addClassModal');
    const addClassBtn = document.getElementById('addClassBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const closeBtn = document.querySelector('.close');
    const addClassForm = document.getElementById('addClassForm');

    // Open modal
    addClassBtn.addEventListener('click', function() {
        modal.classList.add('show');
    });

    // Close modal
    function closeModal() {
        modal.classList.remove('show');
        addClassForm.reset();
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
    addClassForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            className: document.getElementById('className').value,
            major: document.getElementById('major').value,
            department: document.getElementById('department').value
        };

        console.log('Class data to be submitted:', formData);
        
        // TODO: Send data to backend API endpoint
        // For now, just close the modal and clear the form
        closeModal();
    });
});
