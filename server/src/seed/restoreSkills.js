const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Skill = require('../models/Skill');

dotenv.config();

const restoreSkills = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await Skill.deleteMany();

    const richSkills = [
      {
        title: 'Frontend',
        icon: 'Layout',
        skills: ['HTML5', 'CSS3', 'JavaScript (ES6+)', 'React.js', 'Next.js', 'Tailwind CSS', 'Framer Motion', 'Redux', 'Responsive Design'],
        displayOrder: 1
      },
      {
        title: 'Backend',
        icon: 'Server',
        skills: ['Node.js', 'Express.js', 'RESTful APIs', 'JWT Authentication', 'WebSockets', 'GraphQL (Basics)'],
        displayOrder: 2
      },
      {
        title: 'Database & Cloud',
        icon: 'Database',
        skills: ['MongoDB', 'Mongoose', 'SQL (MySQL/PostgreSQL)', 'Firebase', 'Supabase'],
        displayOrder: 3
      },
      {
        title: 'Mobile App Dev',
        icon: 'Smartphone',
        skills: ['Flutter', 'Dart', 'Provider', 'Bloc', 'Cross-Platform UI'],
        displayOrder: 4
      },
      {
        title: 'Tools & DevOps',
        icon: 'GitBranch',
        skills: ['Git', 'GitHub', 'Postman', 'Docker (Basics)', 'Vercel', 'Render', 'NPM/Yarn'],
        displayOrder: 5
      }
    ];

    await Skill.insertMany(richSkills);
    console.log('Rich skills restored!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

restoreSkills();
