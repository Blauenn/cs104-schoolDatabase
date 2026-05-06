async function initStudents() {
	const response = await fetch('/students');
	const students = await response.json();

	const tbody = document.getElementById('students-tbody');
	tbody.innerHTML = '';

	students.forEach(s => {
		tbody.innerHTML += `
            <tr>
                <td>${s.student_id}</td>
                <td>${s.student_first_name}</td>
                <td>${s.student_last_name}</td>
                <td>${s.student_email}</td>
                <td>${s.student_phone}</td>
                <td>${s.student_class_id}</td>
            </tr>
        `;
	});
}

function openAddStudent() {
	// modal logic later
	console.log('open add student modal');
}