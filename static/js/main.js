async function navigateTo(page) {
    const response = await fetch(`/partials/${page}`);
    const html = await response.text();
    document.querySelector('.main-content').innerHTML = html;

    document.querySelectorAll('.sidebar nav a').forEach(a => a.classList.remove('active'));
    document.querySelector(`[data-page="${page}"]`).classList.add('active');

    if (page === 'students') initStudents();
}

document.querySelectorAll('.sidebar nav a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo(link.dataset.page);
    });
});

// load default page
navigateTo('students');