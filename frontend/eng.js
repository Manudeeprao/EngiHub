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
        
        // Get status color and badge
        let badgeColor = '#0066cc'; // Blue for Open
        let statusDisplay = project.status || 'Open';
        
        if (statusDisplay === 'Ongoing') {
            badgeColor = '#ff9800'; // Orange for Ongoing
        } else if (statusDisplay === 'Completed') {
            badgeColor = '#28a745'; // Green for Completed
        }
        
        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px;">
                <h3 style="margin: 0; flex: 1;">${project.title || 'Untitled Project'}</h3>
                <span style="background-color: ${badgeColor}; color: white; padding: 5px 12px; border-radius: 15px; font-size: 12px; font-weight: bold; white-space: nowrap; margin-left: 10px;">${statusDisplay}</span>
            </div>
            <p><strong>Description:</strong> ${project.description || 'N/A'}</p>
            <p><strong>Client:</strong> ${project.clientName || 'N/A'}</p>
            <p><strong>Budget:</strong> $${project.budget || '0'}</p>
            <p><strong>Duration:</strong> ${project.startDate} to ${project.endDate}</p>
            ${remainingDays >= 0 ? `<p><strong>Days Remaining:</strong> <span style="font-weight: 600;">${remainingDays}</span></p>` : '<p><strong>Status:</strong> <span style="color: #dc3545; font-weight: 600;">Overdue</span></p>'}
            <div style="margin-top: 12px; display: flex; gap: 10px; align-items: center;">
                <label for="status-${project.id}" style="font-weight: bold; margin: 0;">Update Status:</label>
                <select id="status-${project.id}" style="padding: 5px 10px; border-radius: 4px; border: 1px solid #ccc;">
                    <option value="Open" ${statusDisplay === 'Open' ? 'selected' : ''}>Open</option>
                    <option value="Ongoing" ${statusDisplay === 'Ongoing' ? 'selected' : ''}>Ongoing</option>
                    <option value="Completed" ${statusDisplay === 'Completed' ? 'selected' : ''}>Completed</option>
                </select>
                <button onclick="updateProjectStatus(${project.id})" style="padding: 5px 15px; background-color: #0066cc; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">Update</button>
            </div>
            <div style="margin-top: 15px; border-top: 1px solid #ddd; padding-top: 12px;">
                <button onclick="toggleActivityLog(${project.id})" style="background: none; border: none; color: #0066cc; cursor: pointer; font-weight: bold; text-decoration: underline; padding: 0;">📋 Project Activity</button>
                <div id="activity-log-${project.id}" style="display: none; margin-top: 10px; max-height: 200px; overflow-y: auto; background: #f5f5f5; padding: 10px; border-radius: 4px;">
                    <div style="text-align: center; color: #999;">Loading activity...</div>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// Toggle and load activity log
async function toggleActivityLog(projectId) {
    const activityDiv = document.getElementById(`activity-log-${projectId}`);
    
    if (activityDiv.style.display === 'none') {
        activityDiv.style.display = 'block';
        // Load activity logs if not already loaded
        if (activityDiv.children.length === 1 && activityDiv.children[0].textContent === 'Loading activity...') {
            await loadActivityLog(projectId);
        }
    } else {
        activityDiv.style.display = 'none';
    }
}

// Load and display activity logs
async function loadActivityLog(projectId) {
    try {
        const response = await fetch(`${API_BASE}/projects/${projectId}/activity`);
        const result = await response.json();
        const activityLogs = result.data || [];
        
        const activityDiv = document.getElementById(`activity-log-${projectId}`);
        
        if (!activityLogs || activityLogs.length === 0) {
            activityDiv.innerHTML = '<p style="color: #999; margin: 0; font-size: 14px;">No activity yet</p>';
            return;
        }
        
        let activityHTML = '';
        activityLogs.forEach(log => {
            const logDate = new Date(log.timestamp);
            const timeAgo = getTimeAgo(logDate);
            activityHTML += `<p style="margin: 8px 0; font-size: 14px;">• ${timeAgo} — ${log.message}</p>`;
        });
        
        activityDiv.innerHTML = activityHTML;
    } catch (err) {
        console.error('Error loading activity logs:', err);
        const activityDiv = document.getElementById(`activity-log-${projectId}`);
        activityDiv.innerHTML = '<p style="color: #dc3545; margin: 0; font-size: 14px;">Failed to load activity</p>';
    }
}

// Helper function to format time ago
function getTimeAgo(date) {
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
}

// Update project status
async function updateProjectStatus(projectId) {
    const statusSelect = document.getElementById(`status-${projectId}`);
    const newStatus = statusSelect.value;
    
    try {
        const response = await fetch(`${API_BASE}/projects/${projectId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: newStatus })
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert(`Project status updated to: ${newStatus}`);
            // Refresh projects list
            loadAssignedProjects();
        } else {
            alert('Failed to update status: ' + result.message);
        }
    } catch (err) {
        console.error('Error updating status:', err);
        alert('Error updating project status');
    }
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
    const active = projects.filter(p => p.status === 'Open' || p.status === 'Ongoing').length;
    const completed = projects.filter(p => p.status === 'Completed').length;
    
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
