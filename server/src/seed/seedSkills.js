const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Skill = require('../models/Skill');

// Load env vars
dotenv.config();

const seedSkills = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log('MongoDB Connected...');

    // Clear existing skills
    await Skill.deleteMany();
    console.log('Existing skills cleared...');

    const initialSkills = [
      {
        title: 'Frontend Development',
        icon: 'Layout',
        skills: ['HTML/CSS', 'JavaScript', 'React.js', 'Next.js', 'Tailwind CSS', 'Bootstrap'],
        displayOrder: 1
      },
      {
        title: 'Backend Development',
        icon: 'Server',
        skills: ['Node.js', 'Express.js', 'REST APIs', 'JWT Auth'],
        displayOrder: 2
      },
      {
        title: 'Database & Cloud',
        icon: 'Database',
        skills: ['MongoDB', 'SQL', 'Firebase', 'Mongoose'],
        displayOrder: 3
      },
      {
        title: 'App Development',
        icon: 'Smartphone',
        skills: ['Flutter', 'Dart', 'Cross-Platform App Dev'],
        displayOrder: 4
      }
    ];

    await Skill.insertMany(initialSkills);
    console.log('Skills imported!');

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedSkills();
