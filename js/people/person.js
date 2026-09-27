const people = {
    'sarah-chen': {
        name: 'Sarah Chen',
        pronouns: 'she/her',
        category: 'Mentor',
        badgeClass: 'badge-green',
        avatarClass: 'avatar-green',
        icon: 'assets/mentor-female-icon.svg',
        roleCompany: 'Principal UX Designer - Figma',
        email: 'sarah.chen@figma.com',
        phone: '+1 (415) 555-0182',
        location: 'San Francisco, CA',
        preferredContact: 'Email',
        birthday: 'Oct 3, 1983 - 42 years old',
        occupation: 'Principal UX Designer',
        workplace: 'Figma',
        howMet: 'Met at a UX conference in 2022. She gave a keynote on design systems and we connected over coffee afterward.',
        dateMet: 'Sep 15, 2022',
        interests: ['Ceramics', 'Hiking', 'Speculative Fiction'],
        skills: ['UX Design', 'Design Systems', 'User Research', 'Figma', 'Leadership'],
        likes: ['Direct feedback', 'Coffee meetings', 'Thoughtful questions'],
        dislikes: ['Vague briefs', 'Last-minute cancellations'],
        notes: 'Incredibly generous with her time. Has a systematic approach to design and a sharp eye for accessible color work. Excellent mentor and always honest with feedback.'
    },

    'marcus-okonkwo': {
        name: 'Marcus Okonkwo',
        pronouns: 'he/him',
        category: 'Coworker',
        badgeClass: 'badge-purple',
        avatarClass: 'avatar-purple',
        icon: 'assets/coworker-male-icon.svg',
        roleCompany: 'Product Strategist - RELM Team',
        email: 'marcus.okonkwo@example.com',
        phone: '+1 (415) 555-0144',
        location: 'Austin, TX',
        preferredContact: 'Message',
        birthday: 'May 18, 1990 - 36 years old',
        occupation: 'Product Strategist',
        workplace: 'RELM Team',
        howMet: 'Worked together on a product planning sprint and kept in touch after the project.',
        dateMet: 'Sep 1, 2026',
        interests: ['Chess', 'Jazz Piano', 'Street Photography'],
        skills: ['Product Strategy', 'Roadmapping', 'Stakeholder Management'],
        likes: ['Clear goals', 'Async updates', 'Creative briefs'],
        dislikes: ['Unclear timelines', 'Long meetings'],
        notes: 'Thoughtful collaborator with strong product instincts and a calm working style.'
    },

    'priya-nair': {
        name: 'Priya Nair',
        pronouns: 'she/her',
        category: 'Friend',
        badgeClass: 'badge-orange',
        avatarClass: 'avatar-orange',
        icon: 'assets/friend-female-icon.svg',
        roleCompany: 'Ceramics Instructor - Studio North',
        email: 'priya.nair@example.com',
        phone: '+1 (415) 555-0188',
        location: 'Portland, OR',
        preferredContact: 'Call',
        birthday: 'Jan 22, 1992 - 34 years old',
        occupation: 'Ceramics Instructor',
        workplace: 'Studio North',
        howMet: 'Met through a pottery class and started exchanging travel and cooking recommendations.',
        dateMet: 'Sep 5, 2026',
        interests: ['Pottery', 'Traveling', 'Cooking'],
        skills: ['Ceramics', 'Teaching', 'Event Planning'],
        likes: ['Weekend catch-ups', 'Food recommendations', 'Small workshops'],
        dislikes: ['Rushed plans', 'Very late replies'],
        notes: 'Warm, creative, and easy to reconnect with even after busy weeks.'
    },

    'amara-diallo': {
        name: 'Amara Diallo',
        pronouns: 'she/her',
        category: 'Family',
        badgeClass: 'badge-red',
        avatarClass: 'avatar-red',
        icon: 'assets/family-female-icon.svg',
        roleCompany: 'Fashion Consultant - Independent',
        email: 'amara.diallo@example.com',
        phone: '+1 (415) 555-0117',
        location: 'New York, NY',
        preferredContact: 'Phone',
        birthday: 'Mar 14, 1988 - 38 years old',
        occupation: 'Fashion Consultant',
        workplace: 'Independent',
        howMet: 'Family connection; often reconnects through travel stories and family updates.',
        dateMet: 'Sep 2, 2026',
        interests: ['Fashion', 'Travel', 'Family Genealogy'],
        skills: ['Styling', 'Research', 'Networking'],
        likes: ['Family calls', 'Travel photos', 'Detailed updates'],
        dislikes: ['Missed occasions', 'Last-minute plans'],
        notes: 'Family-oriented and thoughtful. Good person to contact for family history and travel ideas.'
    },

    'david-kim': {
        name: 'David Kim',
        pronouns: 'he/him',
        category: 'Classmate',
        badgeClass: 'badge-blue',
        avatarClass: 'avatar-blue',
        icon: 'assets/classmate-male-icon.svg',
        roleCompany: 'XR Research Scientist - University Lab',
        email: 'david.kim@example.com',
        phone: '+1 (415) 555-0191',
        location: 'Seoul, South Korea',
        preferredContact: 'Message',
        birthday: 'Jul 9, 1997 - 29 years old',
        occupation: 'XR Research Scientist',
        workplace: 'University Lab',
        howMet: 'Met through a class project and stayed connected through research discussions.',
        dateMet: 'Sep 8, 2026',
        interests: ['Rock Climbing', 'Sci-Fi Film', 'Korean Cooking'],
        skills: ['XR Research', 'Prototyping', 'Academic Writing'],
        likes: ['Research links', 'Focused study sessions', 'Good documentation'],
        dislikes: ['Messy files', 'Unclear requirements'],
        notes: 'Analytical and reliable. Great for research-heavy project conversations.'
    },

    'tom-bergstrom': {
        name: 'Tom Bergstrom',
        pronouns: 'he/him',
        category: 'Other',
        badgeClass: 'badge-gray',
        avatarClass: 'avatar-gray',
        icon: 'assets/other-male-icon.svg',
        roleCompany: 'Open Source Maintainer - Independent',
        email: 'tom.bergstrom@example.com',
        phone: '+1 (415) 555-0132',
        location: 'Stockholm, Sweden',
        preferredContact: 'Email',
        birthday: 'Nov 12, 1986 - 39 years old',
        occupation: 'Open Source Maintainer',
        workplace: 'Independent',
        howMet: 'Connected through an open source discussion and exchanged notes about community work.',
        dateMet: 'Jun 10, 2026',
        interests: ['Open Source', 'Cycling', 'Nordic Cooking'],
        skills: ['Documentation', 'Code Review', 'Community Support'],
        likes: ['Well-written issues', 'Clear documentation', 'Quiet work blocks'],
        dislikes: ['Duplicate reports', 'Unclear bug descriptions'],
        notes: 'Helpful technical contact. Appreciates concise messages and specific context.'
    },

    'jonas-rivera': {
        name: 'Jonas Rivera',
        pronouns: 'he/him',
        category: 'Friend',
        badgeClass: 'badge-orange',
        avatarClass: 'avatar-yellow',
        icon: 'assets/friend-male-icon.svg',
        roleCompany: 'Photographer - Independent',
        email: 'jonas.rivera@example.com',
        phone: '+1 (415) 555-0167',
        location: 'Manila, Philippines',
        preferredContact: 'Message',
        birthday: 'Apr 6, 1994 - 32 years old',
        occupation: 'Photographer',
        workplace: 'Independent',
        howMet: 'Met during a weekend photo walk and kept sharing architecture and cycling routes.',
        dateMet: 'Sep 12, 2026',
        interests: ['Photography', 'Architecture', 'Cycling'],
        skills: ['Photo Editing', 'Composition', 'Visual Storytelling'],
        likes: ['Outdoor shoots', 'Coffee walks', 'Creative ideas'],
        dislikes: ['Poor lighting plans', 'Rushed shoots'],
        notes: 'Creative and observant. Often notices visual details that others miss.'
    },

    'lena-muller': {
        name: 'Lena Muller',
        pronouns: 'she/her',
        category: 'Coworker',
        badgeClass: 'badge-purple',
        avatarClass: 'avatar-purple',
        icon: 'assets/coworker-female-icon.svg',
        roleCompany: 'Product Researcher - RELM Team',
        email: 'lena.muller@example.com',
        phone: '+1 (415) 555-0159',
        location: 'Berlin, Germany',
        preferredContact: 'Email',
        birthday: 'Feb 11, 1991 - 35 years old',
        occupation: 'Product Researcher',
        workplace: 'RELM Team',
        howMet: 'Worked together during Q4 research planning and alignment sessions.',
        dateMet: 'Sep 15, 2026',
        interests: ['Cycling', 'Contemporary Art', 'Sustainability'],
        skills: ['User Interviews', 'Research Synthesis', 'Workshop Facilitation'],
        likes: ['Organized notes', 'User quotes', 'Well-scoped studies'],
        dislikes: ['Biased questions', 'Messy findings'],
        notes: 'Strong researcher with a practical sense of product priorities.'
    },

    'nadia-ahmed': {
        name: 'Nadia Ahmed',
        pronouns: 'she/her',
        category: 'Family',
        badgeClass: 'badge-red',
        avatarClass: 'avatar-red',
        icon: 'assets/family-female-icon.svg',
        roleCompany: 'Community Organizer - Local Network',
        email: 'nadia.ahmed@example.com',
        phone: '+1 (415) 555-0173',
        location: 'Toronto, Canada',
        preferredContact: 'Call',
        birthday: 'Aug 25, 1989 - 37 years old',
        occupation: 'Community Organizer',
        workplace: 'Local Network',
        howMet: 'Family connection; usually catches up through calls about cooking, hiking, and books.',
        dateMet: 'Aug 20, 2026',
        interests: ['Cooking', 'Hiking', 'Reading'],
        skills: ['Community Planning', 'Public Speaking', 'Coordination'],
        likes: ['Family updates', 'Book recommendations', 'Home-cooked meals'],
        dislikes: ['Forgotten follow-ups', 'Unconfirmed plans'],
        notes: 'Supportive and energetic. Good at bringing people together.'
    },

    'james-mitchell': {
        name: 'James Mitchell',
        pronouns: 'he/him',
        category: 'Classmate',
        badgeClass: 'badge-blue',
        avatarClass: 'avatar-blue',
        icon: 'assets/classmate-male-icon.svg',
        roleCompany: 'Graduate Student - Georgia Tech',
        email: 'james.mitchell@example.com',
        phone: '+1 (415) 555-0125',
        location: 'Atlanta, GA',
        preferredContact: 'Message',
        birthday: 'Dec 2, 1998 - 27 years old',
        occupation: 'Graduate Student',
        workplace: 'Georgia Tech',
        howMet: 'Connected through a robotics class update and continued talking about school projects.',
        dateMet: 'Sep 22, 2026',
        interests: ['Robotics', 'Graduate School', 'Running'],
        skills: ['Robotics', 'Technical Writing', 'Presentations'],
        likes: ['Project demos', 'Research updates', 'Clear examples'],
        dislikes: ['Late group submissions', 'Ambiguous rubrics'],
        notes: 'Focused and school-driven. Good contact for academic collaboration.'
    },

    'mei-ling-huang': {
        name: 'Mei-Ling Huang',
        pronouns: 'she/her',
        category: 'Coworker',
        badgeClass: 'badge-purple',
        avatarClass: 'avatar-purple',
        icon: 'assets/coworker-female-icon.svg',
        roleCompany: 'Data Analyst - RELM Team',
        email: 'mei.huang@example.com',
        phone: '+1 (415) 555-0139',
        location: 'Taipei, Taiwan',
        preferredContact: 'Email',
        birthday: 'Jun 30, 1993 - 33 years old',
        occupation: 'Data Analyst',
        workplace: 'RELM Team',
        howMet: 'Walked through retention metrics together and shared notes on dashboard improvements.',
        dateMet: 'Sep 20, 2026',
        interests: ['Data Analysis', 'Metrics', 'Tea'],
        skills: ['Analytics', 'Dashboards', 'SQL', 'Reporting'],
        likes: ['Clean datasets', 'Specific questions', 'Tea breaks'],
        dislikes: ['Missing labels', 'Unverified numbers'],
        notes: 'Careful with data and good at explaining trends in simple terms.'
    },

    'ben-nakamura': {
        name: 'Ben Nakamura',
        pronouns: 'he/him',
        category: 'Friend',
        badgeClass: 'badge-orange',
        avatarClass: 'avatar-orange',
        icon: 'assets/friend-male-icon.svg',
        roleCompany: 'Software Engineer - Startup',
        email: 'ben.nakamura@example.com',
        phone: '+1 (415) 555-0161',
        location: 'Seattle, WA',
        preferredContact: 'Message',
        birthday: 'Sep 17, 1995 - 31 years old',
        occupation: 'Software Engineer',
        workplace: 'Startup',
        howMet: 'Met through a morning run at Forest Park followed by coffee at Water Avenue.',
        dateMet: 'Sep 18, 2026',
        interests: ['Software', 'Morning Runs', 'Coffee'],
        skills: ['Frontend Development', 'Debugging', 'Mentoring'],
        likes: ['Early plans', 'Good coffee', 'Practical solutions'],
        dislikes: ['Overcomplicated fixes', 'Skipped testing'],
        notes: 'Friendly and practical. Good person to ask for lightweight coding advice.'
    },

    'ravi-patel': {
        name: 'Ravi Patel',
        pronouns: 'he/him',
        category: 'Mentor',
        badgeClass: 'badge-green',
        avatarClass: 'avatar-green',
        icon: 'assets/mentor-male-icon.svg',
        roleCompany: 'Product Manager - SaaS Company',
        email: 'ravi.patel@example.com',
        phone: '+1 (415) 555-0184',
        location: 'San Jose, CA',
        preferredContact: 'Email',
        birthday: 'Feb 4, 1985 - 41 years old',
        occupation: 'Product Manager',
        workplace: 'SaaS Company',
        howMet: 'Met through a LinkedIn reconnect after he commented on a product management post.',
        dateMet: 'Sep 25, 2026',
        interests: ['Product Strategy', 'Leadership', 'Startups'],
        skills: ['Product Management', 'Leadership', 'Prioritization'],
        likes: ['Prepared questions', 'Product teardown notes', 'Concise updates'],
        dislikes: ['Unclear goals', 'Scope creep'],
        notes: 'Strategic mentor. Helps connect design decisions with business outcomes.'
    },

    'isabelle-fontaine': {
        name: 'Isabelle Fontaine',
        pronouns: 'she/her',
        category: 'Coworker',
        badgeClass: 'badge-purple',
        avatarClass: 'avatar-purple',
        icon: 'assets/coworker-female-icon.svg',
        roleCompany: 'Product Designer - RELM Team',
        email: 'isabelle.fontaine@example.com',
        phone: '+1 (415) 555-0151',
        location: 'Paris, France',
        preferredContact: 'Email',
        birthday: 'Apr 19, 1992 - 34 years old',
        occupation: 'Product Designer',
        workplace: 'RELM Team',
        howMet: 'Worked together during the design system kickoff and discussed audit approach.',
        dateMet: 'Sep 9, 2026',
        interests: ['Design Systems', 'Research', 'Workshops'],
        skills: ['UI Design', 'Design Systems', 'Accessibility'],
        likes: ['Reusable components', 'Clean spacing', 'Detailed specs'],
        dislikes: ['Inconsistent icons', 'Unlabeled frames'],
        notes: 'Detail-oriented designer who cares about consistency and accessibility.'
    },

    'maya-santos': {
        name: 'Maya Santos',
        pronouns: 'she/her',
        category: 'Friend',
        badgeClass: 'badge-orange',
        avatarClass: 'avatar-orange',
        icon: 'assets/friend-female-icon.svg',
        roleCompany: 'Marketing Coordinator - Creative Studio',
        email: 'maya.santos@example.com',
        phone: '+1 (415) 555-0149',
        location: 'Quezon City, Philippines',
        preferredContact: 'Message',
        birthday: 'Oct 28, 1996 - 30 years old',
        occupation: 'Marketing Coordinator',
        workplace: 'Creative Studio',
        howMet: 'Met through a shared marketing workshop and stayed connected through campaign ideas.',
        dateMet: 'Sep 7, 2026',
        interests: ['Baking', 'Travel', 'Marketing'],
        skills: ['Content Planning', 'Campaign Coordination', 'Branding'],
        likes: ['Creative briefs', 'Travel stories', 'Dessert cafes'],
        dislikes: ['Rushed captions', 'Unclear brand direction'],
        notes: 'Cheerful and creative. Great for brainstorming content ideas.'
    },

    'noah-williams': {
        name: 'Noah Williams',
        pronouns: 'he/him',
        category: 'Other',
        badgeClass: 'badge-gray',
        avatarClass: 'avatar-gray',
        icon: 'assets/other-male-icon.svg',
        roleCompany: 'Community Moderator - Open Source Group',
        email: 'noah.williams@example.com',
        phone: '+1 (415) 555-0129',
        location: 'Denver, CO',
        preferredContact: 'Message',
        birthday: 'Jan 8, 1994 - 32 years old',
        occupation: 'Community Moderator',
        workplace: 'Open Source Group',
        howMet: 'Met through an online community and exchanged thoughts about open source moderation.',
        dateMet: 'Sep 4, 2026',
        interests: ['Open Source', 'Gaming', 'Community'],
        skills: ['Moderation', 'Community Management', 'Conflict Resolution'],
        likes: ['Respectful discussions', 'Clear rules', 'Helpful threads'],
        dislikes: ['Spam', 'Toxic comments'],
        notes: 'Good contact for community-related ideas and online group management.'
    },

    'aisha-khan': {
        name: 'Aisha Khan',
        pronouns: 'she/her',
        category: 'Classmate',
        badgeClass: 'badge-blue',
        avatarClass: 'avatar-blue',
        icon: 'assets/classmate-female-icon.svg',
        roleCompany: 'IT Student - University',
        email: 'aisha.khan@example.com',
        phone: '+1 (415) 555-0178',
        location: 'Manila, Philippines',
        preferredContact: 'Message',
        birthday: 'May 5, 2001 - 25 years old',
        occupation: 'IT Student',
        workplace: 'University',
        howMet: 'Met through a school project involving web design and UI planning.',
        dateMet: 'Aug 31, 2026',
        interests: ['Web Design', 'UI Design', 'School'],
        skills: ['HTML', 'CSS', 'UI Layout', 'Research'],
        likes: ['Clear instructions', 'Simple layouts', 'Shared references'],
        dislikes: ['Confusing requirements', 'Broken links'],
        notes: 'Helpful classmate for UI references and school project discussions.'
    },

    'oliver-smith': {
        name: 'Oliver Smith',
        pronouns: 'he/him',
        category: 'Family',
        badgeClass: 'badge-red',
        avatarClass: 'avatar-red',
        icon: 'assets/family-male-icon.svg',
        roleCompany: 'Operations Lead - Family Business',
        email: 'oliver.smith@example.com',
        phone: '+1 (415) 555-0137',
        location: 'London, UK',
        preferredContact: 'Call',
        birthday: 'Jun 12, 1987 - 39 years old',
        occupation: 'Operations Lead',
        workplace: 'Family Business',
        howMet: 'Family connection; usually reconnects during calls about food, cycling, and movies.',
        dateMet: 'Aug 29, 2026',
        interests: ['Cooking', 'Cycling', 'Movies'],
        skills: ['Operations', 'Planning', 'Team Coordination'],
        likes: ['Family updates', 'Movie recommendations', 'Planned calls'],
        dislikes: ['Late notices', 'Missed family events'],
        notes: 'Dependable family contact. Likes practical updates and scheduled calls.'
    },

    'elena-garcia': {
        name: 'Elena Garcia',
        pronouns: 'she/her',
        category: 'Mentor',
        badgeClass: 'badge-green',
        avatarClass: 'avatar-green',
        icon: 'assets/mentor-female-icon.svg',
        roleCompany: 'UX Research Lead - Design Lab',
        email: 'elena.garcia@example.com',
        phone: '+1 (415) 555-0186',
        location: 'Madrid, Spain',
        preferredContact: 'Email',
        birthday: 'Aug 16, 1984 - 42 years old',
        occupation: 'UX Research Lead',
        workplace: 'Design Lab',
        howMet: 'Met through a UX research session and stayed connected for career advice.',
        dateMet: 'Aug 26, 2026',
        interests: ['Career Advice', 'UX Research', 'Books'],
        skills: ['UX Research', 'Interviewing', 'Career Mentoring'],
        likes: ['Research questions', 'Reading lists', 'Structured notes'],
        dislikes: ['Leading questions', 'Surface-level analysis'],
        notes: 'Excellent mentor for research and career direction. Gives thoughtful feedback.'
    },

    'kenji-tanaka': {
        name: 'Kenji Tanaka',
        pronouns: 'he/him',
        category: 'Coworker',
        badgeClass: 'badge-purple',
        avatarClass: 'avatar-purple',
        icon: 'assets/coworker-male-icon.svg',
        roleCompany: 'Software Engineer - RELM Team',
        email: 'kenji.tanaka@example.com',
        phone: '+1 (415) 555-0157',
        location: 'Tokyo, Japan',
        preferredContact: 'Message',
        birthday: 'Dec 20, 1990 - 35 years old',
        occupation: 'Software Engineer',
        workplace: 'RELM Team',
        howMet: 'Collaborated on engineering planning and frontend implementation notes.',
        dateMet: 'Aug 24, 2026',
        interests: ['Engineering', 'Planning', 'Photography'],
        skills: ['JavaScript', 'Frontend Architecture', 'Planning'],
        likes: ['Clean code', 'Specific bugs', 'Documented decisions'],
        dislikes: ['Unexpected breaking changes', 'Untracked edits'],
        notes: 'Strong engineering teammate. Very useful for code structure and implementation planning.'
    },

    'grace-lee': {
        name: 'Grace Lee',
        pronouns: 'she/her',
        category: 'Friend',
        badgeClass: 'badge-orange',
        avatarClass: 'avatar-orange',
        icon: 'assets/friend-female-icon.svg',
        roleCompany: 'Art Student - Creative Institute',
        email: 'grace.lee@example.com',
        phone: '+1 (415) 555-0141',
        location: 'Los Angeles, CA',
        preferredContact: 'Message',
        birthday: 'Sep 3, 2000 - 26 years old',
        occupation: 'Art Student',
        workplace: 'Creative Institute',
        howMet: 'Met through an art cafe visit and kept sharing cafe and K-drama recommendations.',
        dateMet: 'Aug 21, 2026',
        interests: ['Art', 'Cafe Hopping', 'K-Dramas'],
        skills: ['Illustration', 'Visual Moodboarding', 'Color Pairing'],
        likes: ['Cafe invites', 'Art references', 'Drama recommendations'],
        dislikes: ['Rushed creative work', 'Overcrowded places'],
        notes: 'Creative and easygoing. Good person to ask for aesthetic opinions.'
    },

    'daniel-brown': {
        name: 'Daniel Brown',
        pronouns: 'he/him',
        category: 'Other',
        badgeClass: 'badge-gray',
        avatarClass: 'avatar-gray',
        icon: 'assets/other-male-icon.svg',
        roleCompany: 'Finance Associate - Nonprofit',
        email: 'daniel.brown@example.com',
        phone: '+1 (415) 555-0164',
        location: 'Chicago, IL',
        preferredContact: 'Email',
        birthday: 'Jul 21, 1989 - 37 years old',
        occupation: 'Finance Associate',
        workplace: 'Nonprofit',
        howMet: 'Met through a volunteering event and continued sharing finance and reading recommendations.',
        dateMet: 'Aug 18, 2026',
        interests: ['Volunteering', 'Finance', 'Reading'],
        skills: ['Budgeting', 'Financial Tracking', 'Volunteer Coordination'],
        likes: ['Clear budgets', 'Good books', 'Cause-driven work'],
        dislikes: ['Unclear expenses', 'Missed commitments'],
        notes: 'Organized and thoughtful. Helpful for finance-related questions.'
    },

    'fatima-ali': {
        name: 'Fatima Ali',
        pronouns: 'she/her',
        category: 'Classmate',
        badgeClass: 'badge-blue',
        avatarClass: 'avatar-blue',
        icon: 'assets/classmate-female-icon.svg',
        roleCompany: 'Student Researcher - University',
        email: 'fatima.ali@example.com',
        phone: '+1 (415) 555-0176',
        location: 'Dubai, UAE',
        preferredContact: 'Message',
        birthday: 'Nov 4, 2001 - 25 years old',
        occupation: 'Student Researcher',
        workplace: 'University',
        howMet: 'Met through a class research task and shared presentation notes.',
        dateMet: 'Aug 15, 2026',
        interests: ['Research', 'Presentations', 'Writing'],
        skills: ['Research Writing', 'Presentation Design', 'Summarizing'],
        likes: ['Organized references', 'Clear outlines', 'Practice sessions'],
        dislikes: ['Uncited claims', 'Messy slides'],
        notes: 'Reliable classmate for research-heavy school work and presentations.'
    },

    'mateo-cruz': {
        name: 'Mateo Cruz',
        pronouns: 'he/him',
        category: 'Family',
        badgeClass: 'badge-red',
        avatarClass: 'avatar-red',
        icon: 'assets/family-male-icon.svg',
        roleCompany: 'Music Teacher - Community Center',
        email: 'mateo.cruz@example.com',
        phone: '+1 (415) 555-0122',
        location: 'Cebu, Philippines',
        preferredContact: 'Call',
        birthday: 'Mar 27, 1985 - 41 years old',
        occupation: 'Music Teacher',
        workplace: 'Community Center',
        howMet: 'Family connection; often reconnects through music, basketball, and family gatherings.',
        dateMet: 'Aug 12, 2026',
        interests: ['Music', 'Basketball', 'Family Events'],
        skills: ['Music Teaching', 'Event Support', 'Family Coordination'],
        likes: ['Family gatherings', 'Music updates', 'Basketball games'],
        dislikes: ['Missed calls', 'Unplanned schedule changes'],
        notes: 'Warm family contact. Good person to call for family event updates.'
    }
};

const params = new URLSearchParams(window.location.search);
const personId = params.get('id') || 'sarah-chen';
const person = people[personId] || people['sarah-chen'];

function setText(selector, value) {
    const element = document.querySelector(selector);

    if (element) {
        element.textContent = value;
    }
}

function setHTML(selector, value) {
    const element = document.querySelector(selector);

    if (element) {
        element.innerHTML = value;
    }
}

function renderTags(items) {
    return items.map((item) => `<span class="tag">${item}</span>`).join('');
}

document.title = `${person.name} | RELM`;

const avatar = document.querySelector('[data-person-avatar]');

if (avatar) {
    avatar.className = `avatar avatar-xl ${person.avatarClass}`;
    avatar.innerHTML = `<img src="${person.icon}" alt="" width="44" height="44">`;
}

setText('[data-person-name]', person.name);
setText('[data-person-pronouns]', person.pronouns);
setHTML('[data-person-category]', `<span class="badge ${person.badgeClass}">&bull; ${person.category}</span>`);
setText('[data-person-role-company]', person.roleCompany);

setHTML('[data-person-email]', `<i class="fa-regular fa-envelope"></i> ${person.email}`);
document.querySelector('[data-person-email]')?.setAttribute('href', `mailto:${person.email}`);

setHTML('[data-person-phone]', `<i class="fa-solid fa-phone"></i> ${person.phone}`);
setHTML('[data-person-location]', `<i class="fa-solid fa-location-dot"></i> ${person.location}`);
setText('[data-person-preferred-contact]', person.preferredContact);

setText('[data-person-birthday]', person.birthday);
setText('[data-person-pronouns-detail]', person.pronouns);
setText('[data-person-occupation]', person.occupation);

setHTML('[data-person-category-detail]', `<span class="badge ${person.badgeClass}">&bull; ${person.category}</span>`);
setText('[data-person-workplace]', person.workplace);
setText('[data-person-how-met]', person.howMet);
setText('[data-person-date-met]', person.dateMet);

setHTML('[data-person-interests]', renderTags(person.interests));
setHTML('[data-person-skills]', renderTags(person.skills));
setHTML('[data-person-likes]', renderTags(person.likes));
setHTML('[data-person-dislikes]', renderTags(person.dislikes));

setText('[data-person-notes]', person.notes);

setText('[data-delete-person-title]', `Delete ${person.name}?`);
setText(
    '[data-delete-person-description]',
    `This will permanently remove ${person.name} and all their interactions and reminders.`
);