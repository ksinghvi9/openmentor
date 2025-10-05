// mentor_dashboard.js

document.addEventListener('DOMContentLoaded', () => {
    const auth = firebase.auth();
    const db = firebase.firestore();
    
    const mentorGrid = document.getElementById('mentee-grid');
    const mentorName = document.getElementById('mentor-name');
    const helpedCountSpan = document.getElementById('helped-count');
    const verifiedStatusSpan = document.getElementById('verified-status');

    // Add logout button
    const header = document.querySelector('h1');
    const logoutBtn = document.createElement('button');
    logoutBtn.className = 'btn btn-primary';
    logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Logout';
    logoutBtn.style.float = 'right';
    logoutBtn.onclick = () => {
        auth.signOut().then(() => window.location.href = 'index.html');
    };
    header.parentNode.insertBefore(logoutBtn, header.nextSibling);

    // Check authentication
    auth.onAuthStateChanged(async (user) => {
        if (!user) {
            window.location.href = 'login.html?role=mentor';
            return;
        }

        try {
            // Check if user is a mentor
            const userDoc = await db.collection('users').doc(user.uid).get();
            if (!userDoc.exists || userDoc.data().role !== 'mentor') {
                auth.signOut();
                window.location.href = 'login.html?role=mentor';
                return;
            }

            // Load mentor profile
            const mentorProfile = userDoc.data();
            
            // Update profile information
            document.getElementById('mentor-name').textContent = mentorProfile.name || user.email;
            document.getElementById('profile-name').textContent = mentorProfile.name || user.email;
            document.getElementById('mentor-specialization').textContent = mentorProfile.specialization || 'General Programming';
            document.getElementById('helped-count').textContent = mentorProfile.helpedCount || 0;
            document.getElementById('active-mentees').textContent = mentorProfile.activeMentees || 0;
            document.getElementById('mentored-hours').textContent = mentorProfile.mentoredHours || 0;
            document.getElementById('mentor-rating').textContent = mentorProfile.rating || '4.5';
            
            // Update verification status
            if ((mentorProfile.helpedCount || 0) > 50) {
                verifiedStatusSpan.innerHTML = `🌟 Verified Mentor! <i class="fas fa-check-circle verified-icon"></i>`;
            }

            // Set up expertise tags
            if (mentorProfile.skills && mentorProfile.skills.length > 0) {
                const tagsContainer = document.getElementById('expertise-tags');
                tagsContainer.innerHTML = mentorProfile.skills.map(skill => 
                    `<span class="expertise-tag">${skill}</span>`
                ).join('');
            }

            // Set up mentoring progress
            const completedSessions = mentorProfile.completedSessions || 0;
            const monthlyGoal = 20;
            const progress = (completedSessions / monthlyGoal) * 100;
            document.getElementById('mentoring-progress').style.width = `${Math.min(progress, 100)}%`;
            document.getElementById('completed-sessions').textContent = completedSessions;

            // Initialize dashboard with real data
            loadMenteeRequests();

            // Set up quick action buttons
            setupQuickActionButtons(user.uid);
    } catch (error) {
        console.error("Error loading mentor profile:", error);
    }
}); // <-- End of onAuthStateChanged callback

async function loadMenteeRequests() {
    try {
        // Get active help requests from Firestore
        const helpRequests = await db.collection('helpRequests')
            .where('status', '==', 'needs help')
            .get();

        const requests = {};
        helpRequests.forEach(doc => {
            const data = doc.data();
            if (!requests[data.problem]) {
                requests[data.problem] = [];
            }
            requests[data.problem].push({
                id: doc.id,
                ...data
            });
        });

        // If no real data yet, use mock data
        if (helpRequests.empty) {
            generateCards(groupMenteesbyProblem(MOCK_MENTEES));
        } else {
            generateCards(requests);
        }
    } catch (error) {
        console.error("Error loading help requests:", error);
        // Fallback to mock data
        generateCards(groupMenteesbyProblem(MOCK_MENTEES));
    }
}

function setupQuickActionButtons(mentorId) {
    // Schedule Session button
    document.querySelector('.quick-actions .action-btn:nth-child(1)').addEventListener('click', () => {
        // TODO: Implement session scheduling
        alert('Session scheduling feature coming soon!');
    });

    // Notifications button
    document.querySelector('.quick-actions .action-btn:nth-child(2)').addEventListener('click', () => {
        // TODO: Implement notifications panel
        alert('Notifications feature coming soon!');
    });

    // Settings button
    document.querySelector('.quick-actions .action-btn:nth-child(3)').addEventListener('click', () => {
        // TODO: Implement settings panel
        alert('Settings feature coming soon!');
    });
}

    function groupMenteesbyProblem(mentees) {
        return mentees.filter(m => m.status === 'needs help')
            .reduce((acc, mentee) => {
                acc[mentee.problem] = acc[mentee.problem] || [];
                acc[mentee.problem].push(mentee);
                return acc;
            }, {});
    }

    function generateCards(problems) {
        mentorGrid.innerHTML = ''; // Clear existing content

        for (const problem in problems) {
            const mentees = problems[problem];
            let cardHTML = '';
            
            if (mentees.length >= 2) {
                // Group Card (if >= 2 mentees have same problem)
                const groupSize = Math.min(mentees.length, 10);
                const otherCount = mentees.length > 10 ? ` (+${mentees.length - 10} more)` : '';

                cardHTML = `
                    <div class="card group-card">
                        <h3 class="card-title"><i class="fas fa-users"></i> ${problem} Group</h3>
                        <p><strong>${mentees.length}</strong> Mentees need help with this topic.</p>
                        <p style="font-size: 0.9em; color: #555;">Members: ${mentees.slice(0, groupSize).map(m => m.name).join(', ')}${otherCount}</p>
                        <button class="btn btn-primary chat-btn" data-type="group" data-problem="${problem}">
                            <i class="fas fa-comments"></i> Start Group Chat
                        </button>
                    </div>
                `;
            } else {
                // Individual Mentee Card
                const mentee = mentees[0];
                cardHTML = `
                    <div class="card mentee-card">
                        <h3 class="card-title"><i class="fas fa-user"></i> ${mentee.name}</h3>
                        <p>Needs help with: <strong>${mentee.problem}</strong></p>
                        <p style="font-size: 0.9em; color: #555;">Last Active: ${mentee.lastActive}</p>
                        <button class="btn btn-primary chat-btn" data-type="individual" data-mentee-id="${mentee.id}">
                            <i class="fas fa-comment"></i> Initiate 1-on-1 Chat
                        </button>
                    </div>
                `;
            }
            mentorGrid.innerHTML += cardHTML;
        }

        // Add event listeners to chat buttons
        document.querySelectorAll('.chat-btn').forEach(button => {
            button.addEventListener('click', async (e) => {
                const type = e.currentTarget.dataset.type;
                try {
                    if (type === 'group') {
                        const problem = e.currentTarget.dataset.problem;
                        // Create a group chat in Firestore
                        const chatRef = await db.collection('groupChats').add({
                            problem: problem,
                            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                            mentorId: auth.currentUser.uid
                        });
                        alert(`Starting group chat for: ${problem}`);
                    } else {
                        const menteeId = e.currentTarget.dataset.menteeId;
                        // Create a 1-on-1 chat in Firestore
                        const chatRef = await db.collection('privateChats').add({
                            menteeId: menteeId,
                            mentorId: auth.currentUser.uid,
                            createdAt: firebase.firestore.FieldValue.serverTimestamp()
                        });
                        alert(`Starting 1-on-1 chat with Mentee ID: ${menteeId}`);
                    }
                } catch (error) {
                    console.error("Error creating chat:", error);
                    alert("Failed to start chat. Please try again.");
                }
            });
        });
    }
}); 
