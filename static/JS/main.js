async function navigateTo(page) {
	const response = await fetch(`/partials/${page}`);
	const html = await response.text();
	document.querySelector('.main-content').innerHTML = html;

	document.querySelectorAll('.sidebar nav a').forEach(a => a.classList.remove('active'));
	document.querySelector(`[data-page="${page}"]`).classList.add('active');
	
	if (page === 'home') return;
	if (page === 'students') initStudents();
	if (page === 'teachers') initTeachers();
	if (page === 'classes') initClasses();
	if (page === 'subjects') initSubjects();
	if (page === 'enrollments') initEnrollments();
}

document.querySelectorAll('.sidebar nav a').forEach(link => {
	link.addEventListener('click', (e) => {
		e.preventDefault();
		navigateTo(link.dataset.page);
	});
});

// load default page
navigateTo('home');