// Add any interactive functionality here
document.addEventListener('DOMContentLoaded', function() {
    // Add click animation to buttons
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Optional: Add animation before navigation
            console.log('Navigating to:', this.getAttribute('href'));
        });
    });

    // Optional: Log page load
    console.log('Landing page loaded successfully');
});
