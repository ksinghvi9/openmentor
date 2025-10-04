// data.js

// Sample Mentees Data
const MOCK_MENTEES = [
    // React State Management Group
    { 
        id: 101, 
        name: 'Alice Johnson', 
        problem: 'React State Management', 
        lastActive: '5 min ago', 
        group: 'React Advanced', 
        status: 'needs help',
        description: 'Need help with useContext and Redux implementation'
    },
    { 
        id: 102, 
        name: 'Bob Smith', 
        problem: 'React State Management', 
        lastActive: '10 min ago', 
        group: 'React Advanced', 
        status: 'needs help',
        description: 'Struggling with React Query and cache management'
    },
    { 
        id: 103, 
        name: 'Charlie Brown', 
        problem: 'React State Management', 
        lastActive: '15 min ago', 
        group: 'React Advanced', 
        status: 'needs help',
        description: 'Issues with Redux Toolkit implementation'
    },

    // Open Source Contribution Group
    { 
        id: 104, 
        name: 'Diana Prince', 
        problem: 'First Open Source Contribution', 
        lastActive: '1 hr ago', 
        group: 'OS Contributors', 
        status: 'needs help',
        description: 'Need guidance on first PR to React repository'
    },
    { 
        id: 105, 
        name: 'Ethan Hunt', 
        problem: 'First Open Source Contribution', 
        lastActive: '2 hrs ago', 
        group: 'OS Contributors', 
        status: 'needs help',
        description: 'Looking for good first issues in Node.js'
    },

    // Git Advanced Group
    { 
        id: 106, 
        name: 'Fiona Apple', 
        problem: 'Git Advanced Topics', 
        lastActive: '30 min ago', 
        group: 'Git Masters', 
        status: 'needs help',
        description: 'Need help with git rebase and conflict resolution'
    },
    { 
        id: 107, 
        name: 'George Lucas', 
        problem: 'Git Advanced Topics', 
        lastActive: '45 min ago', 
        group: 'Git Masters', 
        status: 'needs help',
        description: 'Questions about git workflow in large teams'
    }
];

// Sample Mentors Data
const MOCK_MENTORS = [
    { 
        id: 201, 
        name: 'Sarah Connor',
        subject: 'React, Redux, Next.js',
        skills: ['React', 'Redux', 'Next.js', 'JavaScript', 'TypeScript', 'Frontend Development'],
        helpedCount: 156,
        verified: true,
        rating: 4.9,
        specialization: ['Frontend Development', 'State Management', 'Performance Optimization'],
        availableFor: ['group sessions', 'one-on-one', 'code reviews'],
        price: 50,
        languages: ['English', 'Spanish'],
        experience: 8,
        github: 'https://github.com/sarahconnor'
    },
    { 
        id: 202, 
        name: 'Tony Stark',
        subject: 'System Design, DevOps, Cloud',
        skills: ['AWS', 'Kubernetes', 'Docker', 'DevOps', 'CI/CD', 'Cloud Architecture'],
        helpedCount: 234,
        verified: true,
        rating: 4.8,
        specialization: ['AWS', 'Kubernetes', 'Microservices'],
        availableFor: ['system design sessions', 'architecture review'],
        price: 75,
        languages: ['English', 'French'],
        experience: 12,
        github: 'https://github.com/tonystark'
    },
    { 
        id: 203, 
        name: 'Bruce Wayne',
        subject: 'Open Source Contribution, Git',
        skills: ['Git', 'GitHub', 'Open Source', 'Community Management', 'Project Management'],
        helpedCount: 189,
        verified: true,
        rating: 4.9,
        specialization: ['Git Advanced', 'Open Source', 'Community Building'],
        availableFor: ['mentorship', 'project planning'],
        price: 60,
        languages: ['English', 'German'],
        experience: 10,
        github: 'https://github.com/brucewayne'
    },
    { 
        id: 204, 
        name: 'Peter Parker',
        subject: 'Frontend Development, React',
        skills: ['React', 'JavaScript', 'TypeScript', 'Testing', 'Frontend Development'],
        helpedCount: 45,
        verified: false,
        rating: 4.7,
        specialization: ['React', 'TypeScript', 'Testing'],
        availableFor: ['code reviews', 'pair programming'],
        price: 40,
        languages: ['English'],
        experience: 3,
        github: 'https://github.com/peterparker'
    }
];

// Sample Video Tutorials
const MOCK_VIDEOS = [
    {
        id: 301,
        title: 'React State Management Masterclass',
        mentor: 'Sarah Connor',
        url: 'https://www.youtube.com/embed/sample1',
        duration: '45:00',
        level: 'Advanced',
        topics: ['useContext', 'Redux', 'React Query'],
        description: 'Comprehensive guide to state management in React applications'
    },
    {
        id: 302,
        title: 'Contributing to Open Source: Complete Guide',
        mentor: 'Bruce Wayne',
        url: 'https://www.youtube.com/embed/sample2',
        duration: '35:00',
        level: 'Intermediate',
        topics: ['Git', 'GitHub', 'Pull Requests'],
        description: 'Learn how to make your first open source contribution'
    },
    {
        id: 303,
        title: 'Advanced Git Workshop',
        mentor: 'Bruce Wayne',
        url: 'https://www.youtube.com/embed/sample3',
        duration: '60:00',
        level: 'Advanced',
        topics: ['Git Rebase', 'Conflict Resolution', 'Git Workflow'],
        description: 'Master advanced git concepts and workflows'
    },
    {
        id: 304,
        title: 'System Design for Open Source Projects',
        mentor: 'Tony Stark',
        url: 'https://www.youtube.com/embed/sample4',
        duration: '55:00',
        level: 'Advanced',
        topics: ['Architecture', 'Scalability', 'Performance'],
        description: 'Learn how to design scalable open source systems'
    }
];

// Sample Problems/Topics for Search Suggestions
const MOCK_TOPICS = [
    {
        id: 401,
        name: 'React State Management',
        keywords: ['react', 'redux', 'context', 'state', 'frontend'],
        groupName: 'React Advanced',
        activeMentors: [201, 204],
        activeMembers: 15
    },
    {
        id: 402,
        name: 'Open Source Contribution',
        keywords: ['github', 'git', 'opensource', 'contribution', 'PR'],
        groupName: 'OS Contributors',
        activeMentors: [203],
        activeMembers: 12
    },
    {
        id: 403,
        name: 'Git Advanced Topics',
        keywords: ['git', 'rebase', 'merge', 'workflow', 'version control'],
        groupName: 'Git Masters',
        activeMentors: [203],
        activeMembers: 8
    }
];