// mentor_dashboard.js

document.addEventListener('DOMContentLoaded', () => {
    const mentorGrid = document.getElementById('mentee-grid');
    const mentorName = document.getElementById('mentor-name');
    const helpedCountSpan = document.getElementById('helped-count');
    const verifiedStatusSpan = document.getElementById('verified-status');

    // --- MOCK CURRENT MENTOR PROFILE ---
    const currentMentor = MOCK_MENTORS[0]; // Assuming the first mentor is the logged-in user

    mentorName.textContent = currentMentor.name;
    helpedCountSpan.textContent = currentMentor.helpedCount;

    // --- VERIFIED TICK LOGIC ---
    if (currentMentor.helpedCount > 50) {
        verifiedStatusSpan.innerHTML = `🌟 **Verified Mentor!** <i class="fas fa-check-circle verified-icon"></i>`;
    }

    // 1. Group Mentees by Problem (Only include mentees needing help)
    const problems = MOCK_MENTEES.filter(m => m.status === 'needs help').reduce((acc, mentee) => {
        // Use the problem as the key to group them
        acc[mentee.problem] = acc[mentee.problem] || [];
        acc[mentee.problem].push(mentee);
        return acc;
    }, {});

    // 2. Generate Cards
    function generateCards() {
        mentorGrid.innerHTML = ''; // Clear existing content

        for (const problem in problems) {
            const mentees = problems[problem];
            let cardHTML = '';
            
            if (mentees.length >= 2) {
                // --- GROUP CARD LOGIC ---
                const groupSize = Math.min(mentees.length, 5); // Display a few members
                const otherCount = mentees.length > 5 ? ` (+${mentees.length - 5} more)` : '';

                cardHTML = `
                    <div class="card group-card">
                        <h3 class="card-title"><i class="fas fa-users"></i> Group: ${problem}</h3>
                        <p><strong>${mentees.length}</strong> Mentees need help with this topic.</p>
                        <p style="font-size: 0.9em; color: #555;">Members: ${mentees.slice(0, groupSize).map(m => m.name).join(', ')}${otherCount}</p>
                        <button class="btn btn-primary chat-btn" data-type="group" data-problem="${problem}">
                            <i class="fas fa-comments"></i> Start Group Chat
                        </button>
                    </div>
                `;
            } else {
                // --- INDIVIDUAL MENTEE CARD LOGIC ---
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

        // 3. Add Event Listeners for Chat
        document.querySelectorAll('.chat-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const type = e.currentTarget.dataset.type;
                if (type === 'group') {
                    alert(`Action: Initiating group chat for: ${e.currentTarget.dataset.problem}`);
                } else {
                    alert(`Action: Initiating 1-on-1 chat with Mentee ID: ${e.currentTarget.dataset.menteeId}`);
                }
            });
        });
    }

    generateCards();
});