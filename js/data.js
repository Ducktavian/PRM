// Hardcoded mock data

const people = [
  {
    id: 1,
    firstName: "Alex",
    lastName: "Santos",

    contact: {
      emails: [
        "alex.santos@email.com"
      ],
      phones: [
        "+63 917 123 4567"
      ],
      location: "Quezon City, Philippines",
      preferredContact: "Email"
    },

    personalInfo: {
      birthday: "2002-05-14",
      pronouns: "he/him",
      occupation: "Software Developer"
    },

    relationship: {
      category: "Friend",
      workplaceOrSchool: "Tech Solutions Inc.",
      howYouMet: "College",
      dateYouMet: "2021-08-20"
    },

    interests: [
      "Technology",
      "Photography",
      "Gaming"
    ],

    skills: [
      "JavaScript",
      "Web Development",
      "Photography"
    ],

    likes: [
      "Coffee",
      "Photography",
      "Indie Games"
    ],

    dislikes: [
      "Crowded places",
      "Early mornings"
    ],

    sharedTopics: [
      "Web development",
      "Games",
      "College memories"
    ],

    notes:
      "Alex is easy to talk to and often shares interesting programming projects.",

    reminders: [
      {
        id: 101,
        title: "Ask about Alex's new project",
        date: "2026-10-05",
        completed: false
      }
    ],

    interactions: [
      {
        id: 1001,
        type: "Message",
        date: "2026-09-18",
        time: "20:30",
        title: "Caught up about work",
        details:
          "Talked about Alex's new web development project and upcoming plans."
      },
      {
        id: 1002,
        type: "Meetup",
        date: "2026-08-30",
        time: "15:00",
        title: "Coffee meetup",
        details:
          "Met at a cafe and talked about work, games, and college."
      }
    ]
  },

  {
    id: 2,
    firstName: "Mia",
    lastName: "Reyes",

    contact: {
      emails: [
        "mia.reyes@email.com"
      ],
      phones: [
        "+63 918 234 5678"
      ],
      location: "Makati, Philippines",
      preferredContact: "Phone"
    },

    personalInfo: {
      birthday: "2001-11-03",
      pronouns: "she/her",
      occupation: "Graphic Designer"
    },

    relationship: {
      category: "Friend",
      workplaceOrSchool: "Creative Studio",
      howYouMet: "University organization",
      dateYouMet: "2022-02-10"
    },

    interests: [
      "Design",
      "Music",
      "Travel"
    ],

    skills: [
      "Graphic Design",
      "Illustration",
      "Branding"
    ],

    likes: [
      "Matcha",
      "Art museums",
      "K-pop"
    ],

    dislikes: [
      "Very spicy food",
      "Traffic"
    ],

    sharedTopics: [
      "Design",
      "Music",
      "Travel"
    ],

    notes:
      "Mia enjoys discovering new cafes and frequently works on creative projects.",

    reminders: [],

    interactions: [
      {
        id: 2001,
        type: "Message",
        date: "2026-09-15",
        time: "18:45",
        title: "Shared design ideas",
        details:
          "Exchanged ideas about improving portfolio designs."
      }
    ]
  },

  {
    id: 3,
    firstName: "Daniel",
    lastName: "Cruz",

    contact: {
      emails: [
        "daniel.cruz@email.com"
      ],
      phones: [
        "+63 919 345 6789"
      ],
      location: "Pasig, Philippines",
      preferredContact: "Phone"
    },

    personalInfo: {
      birthday: "1998-03-21",
      pronouns: "he/him",
      occupation: "Project Manager"
    },

    relationship: {
      category: "Mentor",
      workplaceOrSchool: "Digital Works",
      howYouMet: "Internship",
      dateYouMet: "2023-06-12"
    },

    interests: [
      "Leadership",
      "Technology",
      "Business"
    ],

    skills: [
      "Project Management",
      "Leadership",
      "Communication"
    ],

    likes: [
      "Coffee",
      "Books",
      "Running"
    ],

    dislikes: [
      "Disorganized meetings",
      "Last-minute changes"
    ],

    sharedTopics: [
      "Career development",
      "Technology",
      "Leadership"
    ],

    notes:
      "Daniel has given useful advice about career development and project management.",

    reminders: [
      {
        id: 301,
        title: "Send career update",
        date: "2026-10-10",
        completed: false
      }
    ],

    interactions: [
      {
        id: 3001,
        type: "Meeting",
        date: "2026-09-10",
        time: "14:00",
        title: "Career discussion",
        details:
          "Discussed career goals and possible professional development opportunities."
      }
    ]
  },

  {
    id: 4,
    firstName: "Sofia",
    lastName: "Garcia",

    contact: {
      emails: [
        "sofia.garcia@email.com"
      ],
      phones: [
        "+63 920 456 7890"
      ],
      location: "Manila, Philippines",
      preferredContact: "Email"
    },

    personalInfo: {
      birthday: "2003-07-09",
      pronouns: "she/her",
      occupation: "University Student"
    },

    relationship: {
      category: "Classmate",
      workplaceOrSchool: "University of Manila",
      howYouMet: "Class",
      dateYouMet: "2024-08-19"
    },

    interests: [
      "Reading",
      "Movies",
      "Writing"
    ],

    skills: [
      "Writing",
      "Research",
      "Presentation"
    ],

    likes: [
      "Books",
      "Movies",
      "Tea"
    ],

    dislikes: [
      "Horror movies",
      "Group projects"
    ],

    sharedTopics: [
      "School",
      "Movies",
      "Books"
    ],

    notes:
      "Sofia is a classmate who often helps with research and school projects.",

    reminders: [],

    interactions: [
      {
        id: 4001,
        type: "Message",
        date: "2026-09-20",
        time: "19:15",
        title: "School project discussion",
        details:
          "Discussed the requirements and tasks for the upcoming project."
      },
      {
        id: 4002,
        type: "Meetup",
        date: "2026-09-05",
        time: "13:00",
        title: "Study session",
        details:
          "Worked together on school requirements at the library."
      }
    ]
  },

  {
    id: 5,
    firstName: "Ethan",
    lastName: "Tan",

    contact: {
      emails: [
        "ethan.tan@email.com"
      ],
      phones: [
        "+63 921 567 8901"
      ],
      location: "Cebu City, Philippines",
      preferredContact: "Email"
    },

    personalInfo: {
      birthday: "2000-01-28",
      pronouns: "he/him",
      occupation: "Entrepreneur"
    },

    relationship: {
      category: "Professional",
      workplaceOrSchool: "Tan Ventures",
      howYouMet: "Networking event",
      dateYouMet: "2025-04-15"
    },

    interests: [
      "Business",
      "Startups",
      "Technology"
    ],

    skills: [
      "Business Strategy",
      "Networking",
      "Marketing"
    ],

    likes: [
      "Business books",
      "Coffee",
      "Travel"
    ],

    dislikes: [
      "Slow internet",
      "Long meetings"
    ],

    sharedTopics: [
      "Startups",
      "Business",
      "Technology"
    ],

    notes:
      "Ethan is interested in startups and frequently discusses business ideas.",

    reminders: [],

    interactions: [
      {
        id: 5001,
        type: "Call",
        date: "2026-09-12",
        time: "16:30",
        title: "Startup discussion",
        details:
          "Discussed a potential collaboration and shared business ideas."
      }
    ]
  },

  {
    id: 6,
    firstName: "Lara",
    lastName: "Villanueva",

    contact: {
      emails: [
        "lara.villanueva@email.com"
      ],
      phones: [
        "+63 922 678 9012"
      ],
      location: "Laguna, Philippines",
      preferredContact: "Phone"
    },

    personalInfo: {
      birthday: "2002-09-17",
      pronouns: "she/her",
      occupation: "Teacher"
    },

    relationship: {
      category: "Friend",
      workplaceOrSchool: "Laguna High School",
      howYouMet: "Mutual friend",
      dateYouMet: "2020-12-06"
    },

    interests: [
      "Teaching",
      "Cooking",
      "Travel"
    ],

    skills: [
      "Teaching",
      "Public Speaking",
      "Cooking"
    ],

    likes: [
      "Filipino food",
      "Beach trips",
      "Coffee"
    ],

    dislikes: [
      "Rainy commutes",
      "Very loud places"
    ],

    sharedTopics: [
      "Travel",
      "Food",
      "Family"
    ],

    notes:
      "Lara enjoys traveling and trying new restaurants with friends.",

    reminders: [],

    interactions: [
      {
        id: 6001,
        type: "Message",
        date: "2026-09-08",
        time: "21:00",
        title: "Planning a trip",
        details:
          "Talked about possible destinations for an upcoming weekend trip."
      }
    ]
  },

  {
    id: 7,
    firstName: "Noah",
    lastName: "Lim",

    contact: {
      emails: [
        "noah.lim@email.com"
      ],
      phones: [
        "+63 923 789 0123"
      ],
      location: "Taguig, Philippines",
      preferredContact: "Email"
    },

    personalInfo: {
      birthday: "1999-12-11",
      pronouns: "they/them",
      occupation: "UX Designer"
    },

    relationship: {
      category: "Professional",
      workplaceOrSchool: "Design Hub",
      howYouMet: "Conference",
      dateYouMet: "2024-10-22"
    },

    interests: [
      "UX Design",
      "Technology",
      "Games"
    ],

    skills: [
      "UI Design",
      "UX Research",
      "Prototyping"
    ],

    likes: [
      "Board games",
      "Minimalist design",
      "Tea"
    ],

    dislikes: [
      "Clutter",
      "Unclear requirements"
    ],

    sharedTopics: [
      "UI/UX",
      "Technology",
      "Design"
    ],

    notes:
      "Noah is someone to contact when discussing UI/UX and design projects.",

    reminders: [],

    interactions: [
      {
        id: 7001,
        type: "Meeting",
        date: "2026-09-17",
        time: "11:00",
        title: "Design feedback",
        details:
          "Reviewed a prototype and discussed possible usability improvements."
      }
    ]
  },

  {
    id: 8,
    firstName: "Grace",
    lastName: "Mendoza",

    contact: {
      emails: [
        "grace.mendoza@email.com"
      ],
      phones: [
        "+63 924 890 1234"
      ],
      location: "Batangas, Philippines",
      preferredContact: "Phone"
    },

    personalInfo: {
      birthday: "2001-04-30",
      pronouns: "she/her",
      occupation: "Content Writer"
    },

    relationship: {
      category: "Friend",
      workplaceOrSchool: "Media Studio",
      howYouMet: "Online community",
      dateYouMet: "2022-11-13"
    },

    interests: [
      "Writing",
      "Books",
      "Film"
    ],

    skills: [
      "Writing",
      "Editing",
      "Storytelling"
    ],

    likes: [
      "Books",
      "Coffee",
      "Documentaries"
    ],

    dislikes: [
      "Spoilers",
      "Extremely loud music"
    ],

    sharedTopics: [
      "Writing",
      "Movies",
      "Books"
    ],

    notes:
      "Grace enjoys discussing books, films, and creative writing.",

    reminders: [],

    interactions: [
      {
        id: 8001,
        type: "Message",
        date: "2026-09-19",
        time: "17:20",
        title: "Book recommendation",
        details:
          "Shared recommendations for books and documentaries."
      }
    ]
  },

  {
    id: 9,
    firstName: "Marco",
    lastName: "Dela Cruz",

    contact: {
      emails: [
        "marco.delacruz@email.com"
      ],
      phones: [
        "+63 925 901 2345"
      ],
      location: "Cavite, Philippines",
      preferredContact: "Email"
    },

    personalInfo: {
      birthday: "2000-06-25",
      pronouns: "he/him",
      occupation: "IT Specialist"
    },

    relationship: {
      category: "Family",
      workplaceOrSchool: "IT Services Co.",
      howYouMet: "Family",
      dateYouMet: "2000-06-25"
    },

    interests: [
      "Computers",
      "Cars",
      "Gaming"
    ],

    skills: [
      "IT Support",
      "Networking",
      "Hardware"
    ],

    likes: [
      "PC building",
      "Racing games",
      "Fast food"
    ],

    dislikes: [
      "Computer bugs",
      "Slow devices"
    ],

    sharedTopics: [
      "Computers",
      "Games",
      "Technology"
    ],

    notes:
      "Marco is a family member who is knowledgeable about computers and hardware.",

    reminders: [],

    interactions: [
      {
        id: 9001,
        type: "Call",
        date: "2026-09-21",
        time: "20:00",
        title: "Tech help",
        details:
          "Called to discuss a computer issue and troubleshoot the problem."
      }
    ]
  }
];
