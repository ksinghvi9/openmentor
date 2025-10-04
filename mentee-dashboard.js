// mentee_dashboard.js

document.addEventListener('DOMContentLoaded', () => {
    const auth = firebase.auth();
    const db = firebase.firestore();
    
    const videoGrid = document.getElementById('video-grid');
    const mentorGrid = document.getElementById('mentor-grid');
    const searchInput = document.getElementById('problem-search');
    const groupSuggestionArea = document.getElementById('group-suggestion-area');
    const aiChatBtn = document.querySelector('.ai-chat-box button');

    // Set up AI Chat button
    aiChatBtn.addEventListener('click', () => {
        // Create AI chat container if it doesn't exist
        let aiChatContainer = document.querySelector('.ai-chat-container');
        if (!aiChatContainer) {
            aiChatContainer = document.createElement('div');
            aiChatContainer.className = 'ai-chat-container';
            aiChatContainer.innerHTML = `
                <div class="ai-chat-header">
                    <h3><i class="fas fa-robot"></i> AI Assistant</h3>
                    <button class="close-btn"><i class="fas fa-times"></i></button>
                </div>
                <div class="ai-chat-messages">
                    <p class="ai-message">Hi! I'm your AI coding assistant. How can I help you today?</p>
                </div>
                <div class="ai-chat-input">
                    <input type="text" placeholder="Type your question...">
                    <button><i class="fas fa-paper-plane"></i></button>
                </div>
            `;
            document.body.appendChild(aiChatContainer);

            // Set up close button
            const closeBtn = aiChatContainer.querySelector('.close-btn');
            closeBtn.addEventListener('click', () => {
                aiChatContainer.remove();
            });

            // Set up message sending
            const input = aiChatContainer.querySelector('input');
            const sendBtn = aiChatContainer.querySelector('.ai-chat-input button');
            const messagesContainer = aiChatContainer.querySelector('.ai-chat-messages');

            function sendMessage() {
                const message = input.value.trim();
                if (message) {
                    // Add user message
                    messagesContainer.innerHTML += `
                        <p class="user-message">${message}</p>
                    `;
                    input.value = '';
                    messagesContainer.scrollTop = messagesContainer.scrollHeight;

                    // Simulate AI response (replace with actual AI integration)
                    setTimeout(() => {
                        messagesContainer.innerHTML += `
                            <p class="ai-message">I understand you're asking about "${message}". I'm currently in development, but I'll be able to help you with coding problems soon!</p>
                        `;
                        messagesContainer.scrollTop = messagesContainer.scrollHeight;
                    }, 1000);
                }
            }

            sendBtn.addEventListener('click', sendMessage);
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    sendMessage();
                }
            });
        }
    });
    
    let currentMentors = [];
    let currentProblems = [];
    
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
            window.location.href = 'login.html?role=mentee';
            return;
        }

        try {
            // Check if user is a mentee
            const userDoc = await db.collection('users').doc(user.uid).get();
            if (!userDoc.exists || userDoc.data().role !== 'mentee') {
                auth.signOut();
                window.location.href = 'login.html?role=mentee';
                return;
            }

            // Initialize dashboard with real data
            initializeDashboard(user);
        } catch (error) {
            console.error("Error loading mentee profile:", error);
            auth.signOut();
        }
    });
    
    async function initializeDashboard(user) {
        try {
            // Load real mentor data from Firestore
            const mentorsSnapshot = await db.collection('users')
                .where('role', '==', 'mentor')
                .orderBy('helpedCount', 'desc')
                .limit(10)
                .get();

            const mentors = mentorsSnapshot.empty ? MOCK_MENTORS : 
                mentorsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

            // Load real video data from Firestore
            const videosSnapshot = await db.collection('videos')
                .orderBy('createdAt', 'desc')
                .limit(5)
                .get();

            const videos = videosSnapshot.empty ? MOCK_VIDEOS :
                videosSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

            displayVideos(videos);
            displayMentors(mentors);
            setupSearch(user.uid);

        } catch (error) {
            console.error("Error initializing dashboard:", error);
            // Fallback to mock data
            displayVideos(MOCK_VIDEOS);
            displayMentors(MOCK_MENTORS);
            setupSearch();
        }
    }

    function displayVideos(videos) {
        videoGrid.innerHTML = videos.map(video => `
            <div class="card video-card">
                <h3 class="card-title">${video.title}</h3>
                <p>Mentor: <strong>${video.mentor}</strong></p>
                <div style="aspect-ratio: 16/9; margin: 10px 0;">
                    <iframe width="100%" height="100%" 
                        src="${video.url}" 
                        frameborder="0" 
                        allowfullscreen>
                    </iframe>
                </div>
                <a href="${video.url}" target="_blank" class="btn btn-primary" style="width: 100%;">
                    Watch on YouTube
                </a>
            </div>
        `).join('');
    }

    function displayMentors(mentors) {
        mentorGrid.innerHTML = mentors.map(mentor => `
            <div class="card mentor-card">
                <h3 class="card-title">
                    <i class="fas fa-graduation-cap"></i> 
                    ${mentor.name}
                    ${mentor.verified ? 
                        `<i class="fas fa-check-circle verified-icon" title="Verified Mentor"></i>` : 
                        ''}
                </h3>
                <p>Expertise: ${mentor.skills ? mentor.skills.join(', ') : mentor.subject}</p>
                <p style="font-size: 0.9em; color: #555;">
                    Helped: ${mentor.helpedCount || 0} students
                </p>
                
                <button class="btn btn-primary chat-btn" data-mentor-id="${mentor.id}">
                    <i class="fas fa-comment"></i> Chat Now
                </button>
                
                ${mentor.verified ? `
                    <button class="btn premium-btn" style="background-color: var(--success-color); color: white; margin-left: 10px; width: auto; float: right;">
                        <i class="fas fa-dollar-sign"></i> Premium Session
                    </button>
                ` : ''}
            </div>
        `).join('');

        // Add chat and premium session functionality
        document.querySelectorAll('.chat-btn').forEach(button => {
            button.addEventListener('click', async (e) => {
                const mentorId = e.currentTarget.dataset.mentorId;
                try {
                    // Check if there's an existing chat
                    const existingChatsSnapshot = await db.collection('chats')
                        .where('mentorId', '==', mentorId)
                        .where('menteeId', '==', auth.currentUser.uid)
                        .where('status', 'in', ['active', 'pending'])
                        .get();

                    if (!existingChatsSnapshot.empty) {
                        alert('You already have an active or pending chat with this mentor.');
                        return;
                    }

                    // Create new chat
                    const chatRef = await db.collection('chats').add({
                        mentorId: mentorId,
                        menteeId: auth.currentUser.uid,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                        status: 'pending'
                    });
                    
                    alert('Chat request sent to mentor!');
                } catch (error) {
                    console.error("Error creating chat:", error);
                    alert("Failed to start chat. Please try again.");
                }
            });
        });

        // Add premium session functionality
        document.querySelectorAll('.premium-btn').forEach(button => {
            button.addEventListener('click', async (e) => {
                const mentorId = e.currentTarget.closest('.mentor-card').querySelector('.chat-btn').dataset.mentorId;
                try {
                    const mentorDoc = await db.collection('users').doc(mentorId).get();
                    const mentorData = mentorDoc.data();
                    const price = mentorData.price || 50; // Default price if not set
                    
                    if (confirm(`Book a premium session with ${mentorData.name} for $${price}/hour?`)) {
                        // Here you would integrate with a payment system
                        alert('Payment system integration coming soon!');
                    }
                } catch (error) {
                    console.error("Error booking premium session:", error);
                    alert("Failed to book premium session. Please try again.");
                }
            });
        });
    }

    // Search and Group Suggestions Logic
    function setupSearch() {
        const skillCheckboxes = document.querySelectorAll('input[name="skill-filter"]');
        let selectedSkills = new Set();
        let searchTimeout;

        // Setup skill filter listeners
        skillCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                if (checkbox.checked) {
                    selectedSkills.add(checkbox.value);
                } else {
                    selectedSkills.delete(checkbox.value);
                }
                performSearch();
            });
        });

        // Setup search input listener with debounce
        searchInput.addEventListener('input', debounce(() => performSearch(), 300));

        async function performSearch() {
            const query = searchInput.value.trim().toLowerCase();
            
            // Show searching state
            if (query || selectedSkills.size > 0) {
                mentorGrid.innerHTML = '<p class="searching">Searching...</p>';
            }

            try {
                const [mentorsSnapshot, problemsSnapshot] = await Promise.all([
                    // Search for mentors
                    db.collection('users')
                        .where('role', '==', 'mentor')
                        .get(),
                    // Search for problems
                    db.collection('problems')
                        .get()
                ]);

                // Filter mentors based on search and skills
                const matchingMentors = mentorsSnapshot.docs
                    .map(doc => ({id: doc.id, ...doc.data()}))
                    .filter(mentor => {
                        // Filter by selected skills
                        const matchesSkills = selectedSkills.size === 0 || (
                            mentor.skills && 
                            Array.from(selectedSkills).some(skill => 
                                mentor.skills.includes(skill)
                            )
                        );

                        // Filter by search query
                        const matchesQuery = !query || (
                            mentor.name.toLowerCase().includes(query) ||
                            (mentor.skills && mentor.skills.some(skill => 
                                skill.toLowerCase().includes(query)
                            )) ||
                            (mentor.subject && mentor.subject.toLowerCase().includes(query))
                        );

                        return matchesSkills && matchesQuery;
                    });

                // Filter problems based on search query and skills
                const matchingProblems = problemsSnapshot.docs
                    .map(doc => ({id: doc.id, ...doc.data()}))
                    .filter(problem => {
                        const matchesSkills = selectedSkills.size === 0 || (
                            problem.tags && 
                            Array.from(selectedSkills).some(skill => 
                                problem.tags.includes(skill)
                            )
                        );

                        const matchesQuery = !query || (
                            problem.title.toLowerCase().includes(query) ||
                            problem.description.toLowerCase().includes(query) ||
                            (problem.tags && problem.tags.some(tag => 
                                tag.toLowerCase().includes(query)
                            ))
                        );

                        return matchesSkills && matchesQuery;
                    });

                updateSearchResults(matchingMentors, matchingProblems);
            } catch (error) {
                console.error("Error performing search:", error);
                mentorGrid.innerHTML = '<p class="error">Error performing search. Please try again.</p>';
                groupSuggestionArea.innerHTML = '';
            }
        }

        function updateSearchResults(mentors, problems) {
        // Update mentors grid with matching mentors
        if (mentors.length > 0) {
            displayMentors(mentors);
        }

        // Update group suggestions
        if (problems.length > 0) {
            groupSuggestionArea.innerHTML = `
                <div class="suggestions-container">
                    <h3>Similar Problems Found:</h3>
                    ${problems.map(problem => `
                        <div class="problem-suggestion">
                            <h4>${problem.title}</h4>
                            <p>${problem.description}</p>
                            <div class="tags">
                                ${problem.tags.map(tag => 
                                    `<span class="tag">${tag}</span>`
                                ).join('')}
                            </div>
                            <button class="btn btn-primary join-group-btn" 
                                    data-problem-id="${problem.id}">
                                Join Group
                            </button>
                        </div>
                    `).join('')}
                </div>
            `;

            // Add event listeners for join buttons
            document.querySelectorAll('.join-group-btn').forEach(button => {
                button.addEventListener('click', async (e) => {
                    const problemId = e.currentTarget.dataset.problemId;
                    try {
                        await joinGroup(problemId);
                        alert('Successfully joined the group!');
                    } catch (error) {
                        console.error("Error joining group:", error);
                        alert('Failed to join group. Please try again.');
                    }
                });
            });
        } else {
            groupSuggestionArea.innerHTML = mentors.length > 0 ? 
                '' : '<p>No matching mentors or groups found.</p>';
        }
    }

    // Helper function to join a group
    async function joinGroup(problemId) {
        const userId = auth.currentUser.uid;
        await db.collection('groupMembers').add({
            userId: userId,
            problemId: problemId,
            joinedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
    }

    // Debounce helper function
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}}
)
