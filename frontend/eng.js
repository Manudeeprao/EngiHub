// ========== API BASE URL ========== 
const API_BASE = 'http://localhost:8080/api';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
    loadEngineerProfile();
    loadAssignedProjects();
});

// Navigation
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('href').substring(1);
            showSection(sectionId);
            
            // Update active link
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
    
    // Show dashboard by default
    showSection('dashboard');
    document.querySelector('a[href="#dashboard"]').classList.add('active');
}

function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.remove('active-section'));
    document.getElementById(sectionId)?.classList.add('active-section');
}

// Load Engineer Profile
async function loadEngineerProfile() {
    const engineerEmail = localStorage.getItem('userEmail');
    const engineerName = localStorage.getItem('username') || 'Engineer';
    
    if (engineerName) {
        document.getElementById('engineer-name').textContent = engineerName;
        document.getElementById('profile-name').textContent = engineerName;
    }
}

// Load Assigned Projects
async function loadAssignedProjects() {
    const engineerEmail = localStorage.getItem('userEmail');
    if (!engineerEmail) {
        showNoProjects();
        return;
    }
    
    let userId = null;
    try {
        const res = await fetch(`${API_BASE}/auth/getUserId?email=${encodeURIComponent(engineerEmail)}`);
        const data = await res.json();
        if (data && data.id) userId = data.id;
    } catch (err) {
        console.log('Engineer userId fetch error:', err);
        showNoProjects();
        return;
    }
    
    try {
        const res = await fetch(`${API_BASE}/assignments/engineer/${userId}`);
        const result = await res.json();
        const projects = result.data || [];
        
        displayProjects(projects);
        updateStats(projects);
    } catch (err) {
        console.log('Assigned projects fetch error:', err);
        showNoProjects();
    }
}

function displayProjects(projects) {
    const container = document.getElementById('projects-list');
    container.innerHTML = '';
    
    if (!projects || projects.length === 0) {
        showNoProjects();
        return;
    }
    
    projects.forEach(project => {
        const card = document.createElement('div');
        card.className = 'project-card';
        
        // Calculate remaining days
        const endDate = new Date(project.endDate);
        const today = new Date();
        const remainingDays = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
        
        // Determine status and styling
        let statusColor = '#666';
        let statusText = project.status;
        
        if (project.status === 'Open') {
            if (remainingDays < 0) {
                statusText = 'Overdue';
                statusColor = '#dc3545';
            } else if (remainingDays <= 7) {
                statusText = `${remainingDays} days left`;
                statusColor = '#ff9800';
            } else {
                statusColor = '#28a745';
            }
        } else {
            statusColor = '#999';
        }
        
        card.innerHTML = `
            <h3>${project.title || 'Untitled Project'}</h3>
            <p><strong>Description:</strong> ${project.description || 'N/A'}</p>
            <p><strong>Client:</strong> ${project.clientName || 'N/A'}</p>
            <p><strong>Budget:</strong> $${project.budget || '0'}</p>
            <p><strong>Duration:</strong> ${project.startDate} to ${project.endDate}</p>
            <p><strong>Status:</strong> <span style="color: ${statusColor}; font-weight: 600;">${statusText}</span></p>
            ${remainingDays >= 0 ? `<p><strong>Days Remaining:</strong> <span style="font-weight: 600;">${remainingDays}</span></p>` : ''}
        `;
        container.appendChild(card);
    });
}

function showNoProjects() {
    const container = document.getElementById('projects-list');
    container.innerHTML = `
        <div class="empty-state">
            <i class="fas fa-inbox"></i>
            <p>No projects assigned yet</p>
        </div>
    `;
}

function updateStats(projects) {
    const total = projects.length;
    const active = projects.filter(p => p.status === 'Open').length;
    const completed = projects.filter(p => p.status === 'Closed').length;
    
    document.getElementById('stat-total-projects').textContent = total;
    document.getElementById('stat-active-projects').textContent = active;
    document.getElementById('stat-completed-projects').textContent = completed;
}

// Profile Management
function openEditProfile() {
    document.getElementById('edit-modal').classList.remove('hidden');
}

function closeEditProfile() {
    document.getElementById('edit-modal').classList.add('hidden');
}

document.getElementById('edit-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const userEmail = localStorage.getItem('userEmail');
    const bio = document.getElementById('edit-bio')?.value || '';
    const experience = document.getElementById('edit-experience')?.value || '';
    
    // Get user ID
    try {
        const userRes = await fetch(`${API_BASE}/auth/getUserId?email=${encodeURIComponent(userEmail)}`);
        const userData = await userRes.json();
        const userId = userData.id;
        
        // Update profile
        const updateRes = await fetch(
            `${API_BASE}/engineers/update/${userId}?bio=${encodeURIComponent(bio)}&experience=${encodeURIComponent(experience)}`,
            { method: 'PUT' }
        );
        const updateData = await updateRes.json();
        
        if (updateData.success) {
            alert('Profile updated successfully!');
            closeEditProfile();
            // Refresh the page to show updated data
            location.reload();
        } else {
            alert('Failed to update profile: ' + updateData.message);
        }
    } catch (err) {
        console.error('Update error:', err);
        alert('Error updating profile');
    }
});

// Logout
function logout() {
    localStorage.removeItem('username');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('role');
    window.location.href = 'index.html';
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    const modal = document.getElementById('edit-modal');
    if (e.target === modal) {
        closeEditProfile();
    }
});
