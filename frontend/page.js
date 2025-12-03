
// Global variables
let projectsModal = null;
let selectedEngineers = new Set();
let lastMatchedProjectId = null;
let currentFormData = null;  // Store form data during matching phase for deferred project creation
let engineerProfiles = null;
let projectFormSection = null;
let matchmakingSection = null;
let resultsSection = null;
let progressBar = null;
let progressText = null;

console.log('page.js loaded');

// ========== PROJECT VALIDATION FUNCTIONS ==========
function validateProjectData(formData) {
    const errors = [];

    // Validate title
    if (!formData.title || formData.title.trim() === '') {
        errors.push('Project title is required.');
    }

    // Validate description
    if (!formData.description || formData.description.trim() === '') {
        errors.push('Project description is required.');
    }

    // Validate disciplines
    if (!formData.disciplines || formData.disciplines.length === 0) {
        errors.push('Please select at least one engineering discipline.');
    }

    // Validate budget
    if (!formData.budget || formData.budget <= 0) {
        errors.push('Project budget must be greater than 0.');
    }

    // Validate start date
    if (!formData.startDate || formData.startDate.trim() === '') {
        errors.push('Project start date is required.');
    }

    // Validate end date
    if (!formData.endDate || formData.endDate.trim() === '') {
        errors.push('Project end date is required.');
    }

    // Validate end date is after start date
    if (formData.startDate && formData.endDate) {
        const startDate = new Date(formData.startDate);
        const endDate = new Date(formData.endDate);
        if (endDate <= startDate) {
            errors.push('Project end date must be after the start date.');
        }
    }

    return errors;
}

function collectProjectFormData() {
    const disciplineCheckboxes = document.querySelectorAll('input[name="disciplines"]:checked');
    const selectedDisciplines = Array.from(disciplineCheckboxes).map(cb => cb.value);

    return {
        title: document.getElementById('project-title').value,
        description: document.getElementById('project-description').value,
        disciplines: selectedDisciplines,
        budget: parseFloat(document.getElementById('project-budget').value),
        startDate: document.getElementById('project-start').value,
        endDate: document.getElementById('project-end').value
    };
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded fired');
    
    // All DOM element references and event listeners go here
    const postProjectBtn = document.querySelector('.post-project-btn');
    projectFormSection = document.getElementById('project-form-section');
    const projectForm = document.getElementById('project-form');
    matchmakingSection = document.getElementById('matchmaking-section');
    progressBar = document.getElementById('matching-progress');
    progressText = document.getElementById('progress-text');
    resultsSection = document.getElementById('results-section');
    engineerProfiles = document.getElementById('engineer-profiles');
    const logoutBtn = document.querySelector('.logout-btn');
    const logoutModal = document.getElementById('logout-modal');
    const successModal = document.getElementById('success-modal');
    const modalOkBtns = document.querySelectorAll('.modal-ok-btn');
    const projectDescription = document.getElementById('project-description');
    const charCounter = document.getElementById('char-counter');
    const fileUpload = document.getElementById('file-upload');
    const fileInput = document.getElementById('additional-files');
    const proceedTeamBtn = document.querySelector('.proceed-team-btn');
    const navLinks = document.querySelectorAll('.nav-link');
    const welcomeUsername = document.getElementById('welcome-username');
    const dashboardUsername = document.getElementById('dashboard-username');

    console.log('postProjectBtn:', postProjectBtn);
    console.log('projectFormSection:', projectFormSection);
    
    // Set username display in header
    const username = localStorage.getItem('username') || 'User';
    const usernameDisplay = document.getElementById('username-display');
    if (usernameDisplay) {
        usernameDisplay.textContent = username;
    }

    // Modal for projects list
    function showProjectsModal(projects) {
        if (!projectsModal) {
            projectsModal = document.createElement('div');
            projectsModal.className = 'projects-modal-overlay';
            projectsModal.innerHTML = `<div class="projects-modal-content">
                <button id="closeProjectsModal" class="close-modal-btn">&times;</button>
                <h2 class="modal-title">Your Projects</h2>
                <div id="projectsList"></div>
            </div>`;
            document.body.appendChild(projectsModal);
            projectsModal.querySelector('#closeProjectsModal').onclick = () => projectsModal.style.display = 'none';
        } else {
            projectsModal.style.display = 'flex';
        }
        const listDiv = projectsModal.querySelector('#projectsList');
        if (!projects || projects.length === 0) {
            listDiv.innerHTML = '<p>No projects found.</p>';
        } else {
            listDiv.innerHTML = projects.map(p => `
                <div class="project-card-modal">
                    <div class="project-header">
                        <span class="project-title">${p.title}</span>
                        <span class="project-status ${p.status && p.status.toLowerCase() === 'open' ? 'status-open' : 'status-other'}">${p.status || ''}</span>
                    </div>
                    <div class="project-details-modal">
                        <div><b>Description:</b> ${p.description}</div>
                        <div><b>Budget:</b> $${p.budget || 'N/A'}</div>
                        <div><b>Start:</b> ${p.startDate || 'N/A'} <b>End:</b> ${p.endDate || 'N/A'}</div>
                        <div><b>Disciplines:</b> ${p.disciplines || ''}</div>
                    </div>
                    <div class="assigned-engineers-modal">
                        <b>Assigned Engineers:</b>
                        <div class="engineer-list-modal" id="eng-list-${p.id}">Loading...</div>
                    </div>
                </div>
            `).join('');
            // For each project, fetch assigned engineers
            projects.forEach(p => fetchAssignedEngineersForProject(p.id));
        }
    }

    // ...existing code for event listeners, form submission, etc. goes here...

    /**
     * Open form and prepare for new submission
     */
    function openProjectForm() {
        console.log('Opening project form');
        projectFormSection.classList.remove('hidden');
        projectFormSection.scrollIntoView({ behavior: 'smooth' });
    }

    /**
     * Reset all global state related to project/matching
     */
    function resetAllGlobalState() {
        console.log('Resetting all global state');
        lastMatchedProjectId = null;
        currentFormData = null;
        selectedEngineers.clear();
        
        // Hide all sections except welcome
        if (matchmakingSection) matchmakingSection.classList.add('hidden');
        if (resultsSection) {
            resultsSection.classList.add('hidden');
            // Remove the proceed button from DOM completely
            const proceedBtn = resultsSection.querySelector('.proceed-team-btn');
            if (proceedBtn) {
                proceedBtn.remove();
            }
            // Clear engineer profiles
            const engProfilesDiv = resultsSection.querySelector('#engineer-profiles');
            if (engProfilesDiv) {
                engProfilesDiv.innerHTML = '';
            }
        }
        
        console.log('Global state reset - lastMatchedProjectId:', lastMatchedProjectId, 'selectedEngineers:', selectedEngineers.size);
    }

    /**
     * Close form and completely reset it
     * Remove all cached data and reset input fields
     */
    function closeProjectForm() {
        console.log('Closing project form and resetting');
        
        // Reset global state first
        resetAllGlobalState();
        
        // Hide form section
        projectFormSection.classList.add('hidden');
        
        // Reset all form fields
        const projectForm = document.getElementById('project-form');
        if (projectForm) {
            projectForm.reset();
        }
        
        // Clear all input values manually to ensure complete reset
        const titleInput = document.getElementById('project-title');
        const descInput = document.getElementById('project-description');
        const budgetInput = document.getElementById('project-budget');
        const startDateInput = document.getElementById('project-start');
        const endDateInput = document.getElementById('project-end');
        const charCounter = document.getElementById('char-counter');
        
        if (titleInput) titleInput.value = '';
        if (descInput) descInput.value = '';
        if (budgetInput) budgetInput.value = '';
        if (startDateInput) startDateInput.value = '';
        if (endDateInput) endDateInput.value = '';
        if (charCounter) charCounter.textContent = '0/1000';
        
        // Uncheck all discipline checkboxes
        const disciplineCheckboxes = document.querySelectorAll('input[name="disciplines"]');
        disciplineCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // Clear engineer profiles display
        if (engineerProfiles) {
            engineerProfiles.innerHTML = '';
        }
        
        console.log('Form completely reset');
    }

    if (postProjectBtn && projectFormSection) {
        postProjectBtn.addEventListener('click', function() {
            console.log('Post a New Project button clicked');
            console.log('Form hidden before:', projectFormSection.classList.contains('hidden'));
            
            const isHidden = projectFormSection.classList.contains('hidden');
            
            if (isHidden) {
                // Opening form - make sure it's clean
                closeProjectForm(); // Reset first
                openProjectForm();
            } else {
                // Closing form - reset completely
                closeProjectForm();
            }
            
            console.log('Form hidden after:', projectFormSection.classList.contains('hidden'));
        });
    } else {
        console.log('postProjectBtn or projectFormSection is null');
        console.log('postProjectBtn:', postProjectBtn);
        console.log('projectFormSection:', projectFormSection);
    }

    if (projectForm) {
        projectForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            console.log('Form submitted - collecting fresh data');

            // ========== FRONTEND VALIDATION ==========
            const formData = collectProjectFormData();
            const validationErrors = validateProjectData(formData);

            if (validationErrors.length > 0) {
                // Show first validation error
                console.error('Validation errors:', validationErrors);
                alert(validationErrors[0]);
                return;
            }

            // Store form data globally for later use in createWithAssignments
            currentFormData = {
                title: formData.title,
                description: formData.description,
                disciplines: formData.disciplines,  // Array
                disciplinesString: formData.disciplines.join(','),  // String for matching
                budget: formData.budget,
                startDate: formData.startDate,
                endDate: formData.endDate
            };
            
            console.log('Form data stored for deferred project creation:', currentFormData);

            // Show progress UI
            matchmakingSection.classList.remove('hidden');
            projectFormSection.classList.add('hidden');
            progressBar.style.width = '0%';
            progressText.textContent = 'Matching 0%';
            let progress = 0;
            const matchInterval = setInterval(() => {
                progress += Math.floor(Math.random() * 10) + 5;
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(matchInterval);
                }
                progressBar.style.width = `${progress}%`;
                progressText.textContent = `Matching ${progress}%`;
            }, 800);

            // Backend integration - CALL MATCHING WITHOUT CREATING PROJECT
            try {
                // Get matched engineers using disciplines WITHOUT creating project first
                const disciplinesString = currentFormData.disciplinesString;
                console.log('Fetching matched engineers for disciplines:', disciplinesString);
                
                const matchRes = await fetch(`http://localhost:8080/api/match/byDisciplines?disciplines=${encodeURIComponent(disciplinesString)}`);
                
                if (!matchRes.ok) {
                    throw new Error(`Match API returned status ${matchRes.status}`);
                }
                
                const matchData = await matchRes.json();
                console.log('Match response:', matchData);

                clearInterval(matchInterval);
                matchmakingSection.classList.add('hidden');
                progressBar.style.width = '100%';
                progressText.textContent = 'Matching 100%';

                // Extract engineers directly from matchData.data
                const engineers = matchData.data;
                
                // Display engineers if found
                if (engineers && Array.isArray(engineers) && engineers.length > 0) {
                    console.log('Displaying', engineers.length, 'engineers');
                    displayEngineerProfiles(engineers);
                } else {
                    console.log('No engineers found in response');
                    // Reset state and show form again
                    resetAllGlobalState();
                    matchmakingSection.classList.add('hidden');
                    projectFormSection.classList.remove('hidden');
                    alert('No matching engineers found for your project.');
                }
            } catch (err) {
                clearInterval(matchInterval);
                // Reset state on error
                resetAllGlobalState();
                matchmakingSection.classList.add('hidden');
                projectFormSection.classList.remove('hidden');
                
                console.error('Engineer matching error:', err);
                alert('An unexpected error occurred while matching engineers.');
            }
        });
    }

    // Engineer selection and proceed with team logic
    document.addEventListener('click', async (e) => {
        if (e.target && e.target.classList.contains('proceed-team-btn')) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Proceed with Team button clicked');
            console.log('Selected engineers Set size:', selectedEngineers.size);
            console.log('Selected engineers array:', Array.from(selectedEngineers));
            
            // Defensive checks
            if (!selectedEngineers || selectedEngineers.size === 0) {
                console.warn('No engineers selected - aborting assignment');
                alert('Please select at least one engineer.');
                return;
            }

            if (!currentFormData) {
                console.warn('No form data found - aborting creation');
                alert('Form data not found. Please start over.');
                return;
            }

            try {
                console.log('Starting project creation with assignments');
                const selectedIds = Array.from(selectedEngineers);
                
                // Final validation before sending
                if (!selectedIds || selectedIds.length === 0) {
                    console.warn('Selected IDs array is empty - aborting');
                    alert('Please select at least one engineer.');
                    return;
                }
                
                // Get client ID
                const clientEmail = localStorage.getItem('userEmail');
                let clientId = 1;
                try {
                    const userRes = await fetch(`http://localhost:8080/api/auth/getUserId?email=${encodeURIComponent(clientEmail)}`);
                    const userData = await userRes.json();
                    if (userData && userData.id) clientId = userData.id;
                } catch (err) {
                    console.log('UserId fetch error:', err);
                }
                
                // Create payload for atomic project + assignments creation
                const createWithAssignmentsPayload = {
                    clientId: clientId,
                    title: currentFormData.title,
                    description: currentFormData.description,
                    disciplines: currentFormData.disciplinesString,
                    budget: currentFormData.budget,
                    startDate: currentFormData.startDate,
                    endDate: currentFormData.endDate,
                    engineerIds: selectedIds
                };
                
                console.log('Sending createWithAssignments request');
                console.log('Payload:', JSON.stringify(createWithAssignmentsPayload));
                
                const res = await fetch('http://localhost:8080/api/projects/createWithAssignments', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(createWithAssignmentsPayload)
                });
                
                console.log('CreateWithAssignments response status:', res.status);
                
                const result = await res.json();
                console.log('CreateWithAssignments result:', result);

                if (!result.success) {
                    const errorMessage = result.message || 'Failed to create project with team.';
                    console.error('Creation failed:', errorMessage);
                    alert(errorMessage);
                    return;
                }

                console.log('Project with assignments created successfully - clearing state');
                // Success - reset and show success message
                selectedEngineers.clear();
                resetAllGlobalState();
                
                // Hide results section and reset form completely
                resultsSection.classList.add('hidden');
                projectFormSection.classList.add('hidden');
                const projectForm = document.getElementById('project-form');
                if (projectForm) projectForm.reset();
                
                // Show success modal or redirect
                if (successModal) {
                    successModal.classList.remove('hidden');
                } else {
                    alert('Project created and team assigned successfully!');
                }

            } catch (err) {
                console.error('Error creating project with team:', err);
                alert('An unexpected error occurred while creating the project.');
            }
        }
    });

    // Character counter for project description
    if (projectDescription && charCounter) {
        projectDescription.addEventListener('input', function() {
            charCounter.textContent = this.value.length + '/1000';
        });
    }

    // Navigation links
    if (navLinks && navLinks.length) {
        navLinks.forEach(link => {
            if (link.textContent.trim() === 'Projects') {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    closeProjectForm(); // Close and reset form
                    fetchAndShowClientProjects();
                });
            } else if (link.textContent.trim() === 'Dashboard') {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    closeProjectForm(); // Close and reset form
                    showDashboard();
                });
            } else if (link.textContent.trim() === 'Home') {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    closeProjectForm(); // Close and reset form
                    showWelcomeSection();
                });
            }
        });
    }

    // Logout button
    if (logoutBtn && logoutModal) {
        logoutBtn.addEventListener('click', () => {
            closeProjectForm(); // Close and reset form on logout
            logoutModal.classList.remove('hidden');
        });
    }

    // Modal OK buttons
    if (modalOkBtns && logoutModal && successModal) {
        modalOkBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (btn.textContent === 'Return to Home') {
                    logoutModal.classList.add('hidden');
                    closeProjectForm(); // Reset form on logout
                    localStorage.removeItem('username');
                    localStorage.removeItem('role');
                    window.location.href = 'index.html';
                } else if (btn.textContent === 'Return to Home Screen') {
                    successModal.classList.add('hidden');
                    closeProjectForm(); // Reset form on success
                    window.location.href = 'index.html';
                }
            });
        });
    }

    // Character counter for description
    if (projectDescription && charCounter) {
        projectDescription.addEventListener('input', () => {
            const currentLength = projectDescription.value.length;
            charCounter.textContent = `${currentLength}/1000`;
        });
    }

    // Show welcome section by default
    showWelcomeSection();
});

async function fetchAssignedEngineersForProject(projectId) {
    // Find all assignments for this project, then fetch engineer details
    try {
        const res = await fetch(`http://localhost:8080/api/assignments/project/${projectId}`);
        const data = await res.json();
        const engDiv = document.getElementById(`eng-list-${projectId}`);
        if (!engDiv) return;
        if (!data || !Array.isArray(data.data) || data.data.length === 0) {
            engDiv.innerHTML = '<span style="color:gray;">No engineers assigned.</span>';
        } else {
            engDiv.innerHTML = data.data.map(e => `
                <div class="engineer-card-modal">
                    <div class="engineer-name">${e.name}</div>
                    <div class="engineer-spec">${e.specialization} | ${e.experience}</div>
                    <div class="engineer-bio">${e.bio}</div>
                </div>
            `).join('');
        }
    } catch (err) {
        const engDiv = document.getElementById(`eng-list-${projectId}`);
        if (engDiv) engDiv.innerHTML = '<span style="color:gray;">Error loading engineers.</span>';
    }
}

async function fetchAndShowClientProjects() {
    const clientEmail = localStorage.getItem('userEmail');
    let clientId = 1;
    if (clientEmail) {
        try {
            const res = await fetch(`http://localhost:8080/api/auth/getUserId?email=${encodeURIComponent(clientEmail)}`);
            const data = await res.json();
            if (data && data.id) clientId = data.id;
        } catch (err) { console.log('UserId fetch error:', err); }
    }
    try {
        const res = await fetch(`http://localhost:8080/api/projects/client/${clientId}`);
        const projects = await res.json();
        showProjectsModal(projects);
    } catch (err) {
        showProjectsModal([]);
    }
}

function showDashboard() {
    // Hide all main sections except dashboard
    document.getElementById('dashboard-section').classList.remove('hidden');
    document.querySelector('.welcome-section').classList.add('hidden');
    document.getElementById('project-form-section').classList.add('hidden');
    document.getElementById('matchmaking-section').classList.add('hidden');
    document.getElementById('results-section').classList.add('hidden');
    // Set username
    const username = localStorage.getItem('username') || 'User';
    document.getElementById('welcome-username').textContent = username;
    document.getElementById('dashboard-username').textContent = username;
    // Fetch and show stats
    fetchAndShowClientStats();
}

function showWelcomeSection() {
    document.getElementById('dashboard-section').classList.add('hidden');
    document.querySelector('.welcome-section').classList.remove('hidden');
    document.getElementById('project-form-section').classList.add('hidden');
    document.getElementById('matchmaking-section').classList.add('hidden');
    document.getElementById('results-section').classList.add('hidden');
}

async function fetchAndShowClientStats() {
    const clientEmail = localStorage.getItem('userEmail');
    let clientId = 1;
    if (clientEmail) {
        try {
            const res = await fetch(`http://localhost:8080/api/auth/getUserId?email=${encodeURIComponent(clientEmail)}`);
            const data = await res.json();
            if (data && data.id) clientId = data.id;
        } catch (err) { console.log('UserId fetch error:', err); }
    }
    try {
        const res = await fetch(`http://localhost:8080/api/projects/client/${clientId}`);
        const projects = await res.json();
        let total = 0, open = 0, closed = 0;
        if (Array.isArray(projects)) {
            total = projects.length;
            open = projects.filter(p => (p.status || '').toLowerCase() === 'open').length;
            closed = projects.filter(p => (p.status || '').toLowerCase() === 'closed').length;
        }
        document.getElementById('stat-total-projects').textContent = total;
        document.getElementById('stat-open-projects').textContent = open;
        document.getElementById('stat-closed-projects').textContent = closed;
    } catch (err) {
        document.getElementById('stat-total-projects').textContent = '0';
        document.getElementById('stat-open-projects').textContent = '0';
        document.getElementById('stat-closed-projects').textContent = '0';
    }
}

// Engineer selection and proceed with team logic already declared globally

function updateProceedTeamBtn() {
    const proceedBtn = document.querySelector('.proceed-team-btn');
    if (!proceedBtn) return;
    if (selectedEngineers.size > 0) {
        proceedBtn.disabled = false;
        proceedBtn.classList.remove('disabled');
        proceedBtn.textContent = `Proceed with Team (${selectedEngineers.size} selected)`;
        console.log('Button enabled');
    } else {
        proceedBtn.disabled = true;
        proceedBtn.classList.add('disabled');
        proceedBtn.textContent = 'Select Engineers to Proceed';
        console.log('Button disabled');
    }
}

function handleFiles(files) {
    console.log('Files uploaded:', files);
}

// Modern engineer selection UI with AI-based sorting and proceed flow
function displayEngineerProfiles(engineers) {
    console.log('displayEngineerProfiles called with:', engineers);
    
    if (!Array.isArray(engineers)) {
        console.error('Error: engineers is not an array', engineers);
        alert('Error matching engineers: Invalid data received from server.');
        return;
    }
    
    if (engineers.length === 0) {
        console.warn('No engineers to display');
        alert('No engineers matched for your project.');
        return;
    }
    
    console.log('Displaying', engineers.length, 'engineers');
    
    // Clear previous selections
    selectedEngineers = new Set();
    
    // AI-based sorting: prioritize by specialization match and experience (years)
    const disciplineCheckboxes = document.querySelectorAll('input[name="disciplines"]:checked');
    const selectedDisciplines = Array.from(disciplineCheckboxes).map(cb => cb.value.toLowerCase());
    
    engineers.sort((a, b) => {
        const aMatch = selectedDisciplines.includes((a.specialization||'').toLowerCase()) ? 1 : 0;
        const bMatch = selectedDisciplines.includes((b.specialization||'').toLowerCase()) ? 1 : 0;
        if (bMatch !== aMatch) return bMatch - aMatch;
        const aExp = parseInt(a.experience) || 0;
        const bExp = parseInt(b.experience) || 0;
        return bExp - aExp;
    });
    
    // Clear existing profiles
    engineerProfiles.innerHTML = '';
    
    // Create engineer cards
    engineers.forEach(engineer => {
        console.log('Creating card for engineer:', engineer.id, engineer.name);
        const profile = document.createElement('div');
        profile.classList.add('engineer-profile', 'selectable');
        profile.setAttribute('data-engineer-id', engineer.id);
        profile.innerHTML = `
            <div class="profile-img-placeholder"></div>
            <h3>${engineer.name && engineer.name.trim() ? engineer.name : 'Engineer'}</h3>
            <p><b>Specialization:</b> ${engineer.specialization || 'N/A'}</p>
            <p><b>Experience:</b> ${engineer.experience || 'N/A'} years</p>
            <p><b>Bio:</b> ${engineer.bio || 'No bio available'}</p>
            <div class="select-indicator">✓ Selected</div>
        `;
        profile.style.cursor = 'pointer';
        
        // Click handler for selection
        profile.addEventListener('click', function(e) {
            e.stopPropagation();
            console.log('Engineer card clicked:', engineer.name, 'ID:', engineer.id);
            
            if (selectedEngineers.has(engineer.id)) {
                console.log('Removing engineer:', engineer.id);
                selectedEngineers.delete(engineer.id);
                profile.classList.remove('selected');
            } else {
                console.log('Adding engineer:', engineer.id);
                selectedEngineers.add(engineer.id);
                profile.classList.add('selected');
            }
            
            console.log('Selected engineers count:', selectedEngineers.size);
            console.log('All selected IDs:', Array.from(selectedEngineers));
            updateProceedTeamBtn();
        });
        
        engineerProfiles.appendChild(profile);
    });
    
    // Ensure results section is visible
    console.log('Showing results section');
    resultsSection.classList.remove('hidden');
    resultsSection.style.display = 'block';
    
    // Remove old Proceed button if it exists
    const oldProceedBtn = resultsSection.querySelector('.proceed-team-btn');
    if (oldProceedBtn) {
        console.log('Removing old Proceed button');
        oldProceedBtn.remove();
    }
    
    // Create and insert Proceed with Team button
    console.log('Creating new Proceed with Team button');
    const proceedBtn = document.createElement('button');
    proceedBtn.type = 'button';
    proceedBtn.className = 'proceed-team-btn';
    proceedBtn.textContent = 'Proceed with Team';
    proceedBtn.style.display = 'block';
    proceedBtn.style.margin = '32px auto 0 auto';
    proceedBtn.style.zIndex = '100';
    proceedBtn.style.position = 'relative';
    proceedBtn.disabled = true;
    
    // Append button to results section directly
    resultsSection.appendChild(proceedBtn);
    
    // Ensure button is in correct state
    updateProceedTeamBtn();
    
    // Scroll to results
    console.log('Scrolling to results section');
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

