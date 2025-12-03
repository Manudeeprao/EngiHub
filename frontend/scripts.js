
// ========== API BASE URL ========== 
const API_BASE = 'http://localhost:8080/api';

// ========== ALERT HELPER ========== //
function showAlert(message, success = true) {
    // You can customize this to use a modal, toast, etc.
    alert(message);
}

// ========== AUTH ========== //
async function loginUser(selectedRole) {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const messageDiv = document.getElementById('loginMessage');
    messageDiv.textContent = '';

    if (!email || !/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
        messageDiv.textContent = 'Valid email is required.';
        return;
    }
    if (!password || password.length < 6) {
        messageDiv.textContent = 'Password must be at least 6 characters.';
        return;
    }
    if (!selectedRole) {
        messageDiv.textContent = 'Please select your role.';
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, role: selectedRole })
        });
        const data = await res.json();
        console.log('Login response:', data);
        if (data.success) {
            localStorage.setItem('userEmail', email);
            localStorage.setItem('userRole', data.role);
            messageDiv.style.color = 'green';
            messageDiv.textContent = 'Login successful! Redirecting...';
            setTimeout(() => {
                const role = (data.role || '').toLowerCase();
                if (role === 'client') {
                    window.location.href = 'page.html';
                } else if (role === 'engineer') {
                    window.location.href = 'eng.html';
                } else {
                    window.location.href = 'index.html';
                }
            }, 1200);
        } else {
            messageDiv.style.color = 'red';
            messageDiv.textContent = data.message || 'Login failed!';
        }
    } catch (err) {
        messageDiv.style.color = 'red';
        messageDiv.textContent = 'Login failed: ' + err.message;
        console.log('Login error:', err);
    }
}

async function signupUser() {
    let name, email, password, role, specialization, experience, bio, messageDiv;
    // Detect which form is being submitted
    if (document.getElementById('signupClientForm') && document.activeElement && document.activeElement.form === document.getElementById('signupClientForm')) {
        name = document.getElementById('signupClientName').value.trim();
        email = document.getElementById('signupClientEmail').value.trim();
        password = document.getElementById('signupClientPassword').value;
        role = document.getElementById('signupClientRole').value;
        messageDiv = document.getElementById('signupClientMessage');
    } else {
        name = document.getElementById('signupEngineerName').value.trim();
        email = document.getElementById('signupEngineerEmail').value.trim();
        password = document.getElementById('signupEngineerPassword').value;
        role = document.getElementById('signupEngineerRole').value;
        specialization = document.getElementById('signupEngineerSpecialization').value;
        experience = document.getElementById('signupEngineerExperience').value.trim();
        bio = document.getElementById('signupEngineerBio').value.trim();
        messageDiv = document.getElementById('signupEngineerMessage');
    }

    messageDiv.textContent = '';

    if (!name) {
        messageDiv.textContent = 'Name is required.';
        return;
    }
    if (!email || !/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
        messageDiv.textContent = 'Valid email is required.';
        return;
    }
    if (!password || password.length < 6) {
        messageDiv.textContent = 'Password must be at least 6 characters.';
        return;
    }
    if (!role) {
        messageDiv.textContent = 'Role is required.';
        return;
    }
    if (role === 'Engineer') {
        if (!specialization) {
            messageDiv.textContent = 'Specialization is required.';
            return;
        }
        if (!experience) {
            messageDiv.textContent = 'Experience is required.';
            return;
        }
        if (!bio) {
            messageDiv.textContent = 'Bio is required.';
            return;
        }
    }

    try {
        const payload = { name, email, password, role };
        if (role === 'Engineer') {
            payload.specialization = specialization;
            payload.experience = experience;
            payload.bio = bio;
        }
        const res = await fetch(`${API_BASE}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        console.log('Signup response:', data);
        if (data.success) {
            showAlert('Signup successful! Please login.', true);
            window.location.href = 'login.html';
        } else {
            messageDiv.textContent = data.message || 'Signup failed!';
        }
    } catch (err) {
        messageDiv.textContent = 'Signup failed: ' + err.message;
        console.log('Signup error:', err);
    }
}

// ========== ENGINEER ========== //
async function registerEngineer() {
    // Implement engineer registration if needed
}

// Removed loadEngineers project creation logic. Use createProject() below.

// ========== CREATE PROJECT ========== //
async function createProject() {
    const title = document.getElementById('project-title').value.trim();
    const description = document.getElementById('project-description').value.trim();
    const budget = parseFloat(document.getElementById('project-budget').value);
    const startDate = document.getElementById('project-start').value;
    const endDate = document.getElementById('project-end').value;
    const clientEmail = localStorage.getItem('userEmail');
    const alertDiv = document.getElementById('createProjectAlert') || { innerText: '' };
    alertDiv.innerText = '';

    // Collect selected engineer types (disciplines)
    const disciplineCheckboxes = document.querySelectorAll('input[name="disciplines"]:checked');
    const disciplines = Array.from(disciplineCheckboxes).map(cb => cb.value);

    if (!title) {
        alertDiv.innerText = 'Project title is required.';
        return;
    }
    if (!description) {
        alertDiv.innerText = 'Description is required.';
        return;
    }
    if (disciplines.length === 0) {
        alertDiv.innerText = 'Select at least one engineering discipline.';
        return;
    }
    if (isNaN(budget) || budget <= 0) {
        alertDiv.innerText = 'Budget is required and must be positive.';
        return;
    }
    if (!startDate) {
        alertDiv.innerText = 'Start date is required.';
        return;
    }
    if (!endDate) {
        alertDiv.innerText = 'End date is required.';
        return;
    }
    if (!clientEmail) {
        alertDiv.innerText = 'You must be logged in to create a project.';
        return;
    }

    let clientId = 1;
    try {
        const res = await fetch(`${API_BASE}/auth/getUserId?email=${encodeURIComponent(clientEmail)}`);
        const data = await res.json();
        if (data && data.id) clientId = data.id;
    } catch (err) {
        console.log('UserId fetch error:', err);
    }

    try {
        const res = await fetch(`${API_BASE}/projects/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title,
                description,
                disciplines,
                budget,
                startDate,
                endDate,
                clientId,
                status: 'Open'
            })
        });
        const data = await res.json();
        console.log('Create project response:', data);
        if (data.id) {
            alertDiv.innerText = 'Project created!';
            showAlert('Project created!', true);
            if (document.getElementById('project-form')) document.getElementById('project-form').reset();
            loadClientProjects();
            // Fetch matched engineers and display them
            try {
                const matchRes = await fetch(`${API_BASE}/match/${data.id}`);
                const matchData = await matchRes.json();
                const engineers = matchData.data || [];
                const matchDiv = document.getElementById('matchedEngineers') || document.createElement('div');
                matchDiv.id = 'matchedEngineers';
                matchDiv.innerHTML = '<h3>Matched Engineers</h3>';
                if (engineers.length === 0) {
                    matchDiv.innerHTML += '<p>No engineers matched for this project.</p>';
                } else {
                    matchDiv.innerHTML += '<ul>' + engineers.map(e => `<li>${e.specialization} - ${e.experience} - ${e.bio}</li>`).join('') + '</ul>';
                }
                document.body.appendChild(matchDiv);
            } catch (err) {
                console.log('Match engineers error:', err);
            }
        } else {
            alertDiv.innerText = 'Failed to create project.';
            showAlert('Failed to create project.', false);
        }
    } catch (err) {
        alertDiv.innerText = 'Failed to create project.';
        showAlert('Failed to create project: ' + err.message, false);
        console.log('Create project error:', err);
    }
}

async function loadClientProjects() {
    const clientEmail = localStorage.getItem('userEmail');
    let clientId = 1;
    if (clientEmail) {
        try {
            const res = await fetch(`${API_BASE}/auth/getUserId?email=${encodeURIComponent(clientEmail)}`);
            const data = await res.json();
            if (data && data.id) clientId = data.id;
        } catch (err) {
            console.log('UserId fetch error:', err);
        }
    }
    try {
        const res = await fetch(`${API_BASE}/projects/list/${clientId}`);
        const result = await res.json();
        const projects = result.data || [];
        console.log('Projects response:', projects);
        const container = document.getElementById('clientProjects');
        container.innerHTML = '';
        if (!projects || projects.length === 0) {
            container.innerHTML = '<p>No projects found.</p>';
        } else {
            projects.forEach(p => {
                const div = document.createElement('div');
                div.className = 'project-card';
                div.innerHTML = `<b>${p.title}</b> <span style='color:gray'>(${p.category})</span><br><span>${p.description}</span>`;
                container.appendChild(div);
            });
        }
    } catch (err) {
        showAlert('Failed to load projects: ' + err.message, false);
        console.log('Load projects error:', err);
    }
}

// ========== MATCHING ========== //
async function matchEngineer(projectId) {
    try {
        const res = await fetch(`${API_BASE}/match/${projectId}`);
        const engineers = await res.json();
        // TODO: Render matched engineers in your HTML
    } catch (err) {
        showAlert('Failed to match engineers: ' + err.message, false);
    }
}

// ========== ENGINEER DASHBOARD ========== //
async function loadAvailableProjects() {
    // For demo, fetch all projects
    try {
        const res = await fetch(`${API_BASE}/projects/client/1`); // Replace with actual endpoint for available projects
        const projects = await res.json();
        const container = document.getElementById('availableProjects');
        container.innerHTML = '';
        projects.forEach(p => {
            const div = document.createElement('div');
            div.innerHTML = `<b>${p.title}</b> - ${p.category}<br>${p.description}<button onclick="matchEngineer(${p.id})">Match</button>`;
            container.appendChild(div);
        });
    } catch (err) {
        showAlert('Failed to load available projects: ' + err.message, false);
    }
}

function logout() {
    localStorage.clear();
    window.location.href = 'index.html';
}
