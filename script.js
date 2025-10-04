// Check if user is already logged in
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // Check user role and redirect accordingly
        firebase.firestore().collection('users').doc(user.uid).get()
            .then((doc) => {
                if (doc.exists) {
                    const role = doc.data().role;
                    window.location.href = role === 'mentor' ? 'mentor-dashboard.html' : 'mentee-dashboard.html';
                }
            })
            .catch((error) => {
                console.error("Error checking user role:", error);
            });
    }
});

function goToLogin(role) {
    // Store the role in session storage for registration flow
    sessionStorage.setItem('selectedRole', role);
    window.location.href = `login.html?role=${role}`;
}

function goToRegister() {
    const role = sessionStorage.getItem('selectedRole') || 'mentee';
    window.location.href = `register.html?role=${role}`;
}

function toggleSkillsSection() {
    const role = document.getElementById('role').value;
    const mentorSkills = document.getElementById('mentor-skills-section');
    if (mentorSkills) {
        mentorSkills.style.display = role === 'mentor' ? 'block' : 'none';
    }
}

async function handleRegister(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const name = document.getElementById('name').value;
    const role = document.getElementById('role').value;
    
    try {
        // Create user in Firebase Auth
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        // Prepare user data
        const userData = {
            name,
            email,
            role,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        // Add skills data for mentors
        if (role === 'mentor') {
            const skillsCheckboxes = document.querySelectorAll('input[name="skills"]:checked');
            const skills = Array.from(skillsCheckboxes).map(cb => cb.value);
            const experience = document.getElementById('experience').value;
            const github = document.getElementById('github').value;
            
            userData.skills = skills;
            userData.experience = parseInt(experience) || 0;
            userData.github = github;
            userData.verified = false;
            userData.helpedCount = 0;
            userData.rating = 0;
            userData.subject = skills.join(', ');
        }

        // Save user data to Firestore
        await firebase.firestore().collection('users').doc(user.uid).set(userData);
        
        // Redirect to appropriate dashboard
        window.location.href = role === 'mentor' ? 'mentor-dashboard.html' : 'mentee-dashboard.html';
    } catch (error) {
        console.error('Error during registration:', error);
        alert('Registration failed: ' + error.message);
    }
}

function toggleSkillsSection() {
    const role = document.getElementById('role').value;
    const skillsSection = document.getElementById('mentor-skills-section');
    skillsSection.style.display = role === 'mentor' ? 'block' : 'none';
}

async function handleRegister(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const name = document.getElementById('name').value;
    const role = document.getElementById('role').value;
    
    try {
        // Create user in Firebase Auth
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        // Prepare user data
        const userData = {
            name,
            email,
            role,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        // Add skills data for mentors
        if (role === 'mentor') {
            const skillsCheckboxes = document.querySelectorAll('input[name="skills"]:checked');
            const skills = Array.from(skillsCheckboxes).map(cb => cb.value);
            const experience = document.getElementById('experience').value;
            const github = document.getElementById('github').value;
            
            userData.skills = skills;
            userData.experience = parseInt(experience);
            userData.github = github;
            userData.verified = false; // New mentors start as unverified
        }

        // Save user data to Firestore
        await firebase.firestore().collection('users').doc(user.uid).set(userData);
        
        // Redirect to appropriate dashboard
        window.location.href = role === 'mentor' ? 'mentor-dashboard.html' : 'mentee-dashboard.html';
    } catch (error) {
        console.error('Error during registration:', error);
        alert('Registration failed: ' + error.message);
    }
}