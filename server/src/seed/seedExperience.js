const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Experience = require('../models/Experience');

dotenv.config();

const seedExperience = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await Experience.deleteMany();

    const experiences = [
      {
        type: 'work',
        title: 'Full-Stack Developer',
        company: 'Tech Solutions Inc.',
        period: 'Jan 2024 - Present',
        startDate: new Date('2024-01-01'), // Newest
        description: 'Developing scalable web applications using Next.js, React, and Node.js. Improved performance of the legacy platform by 40%.',
        skills: ['React', 'Next.js', 'Node.js', 'MongoDB']
      },
      {
        type: 'work',
        title: 'App Developer (Intern)',
        company: 'Mobile Innovators',
        period: 'Jun 2023 - Dec 2023',
        startDate: new Date('2023-06-01'), // Older
        description: 'Assisted in the development of cross-platform mobile apps using Flutter. Implemented state management and API integrations.',
        skills: ['Flutter', 'Dart', 'Firebase', 'REST API']
      },
      {
        type: 'education',
        title: 'Bachelor of Technology in Computer Science',
        company: 'University of Engineering',
        period: '2020 - 2024',
        startDate: new Date('2020-08-01'), // Oldest
        description: 'Graduated with honors. Coursework focused on data structures, algorithms, database management, and software engineering.',
        skills: ['C++', 'Java', 'SQL', 'OS', 'Networking']
      }
    ];

    await Experience.insertMany(experiences);
    console.log('Experiences seeded successfully!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedExperience();
