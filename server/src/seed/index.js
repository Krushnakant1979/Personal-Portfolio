const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const Project = require('../models/Project');
const Admin = require('../models/Admin');
const connectDB = require('../config/db');

const path = require('path');
dotenv.config({ path: path.join(__dirname, '../../.env') });
connectDB();

const importData = async () => {
  try {
    await Project.deleteMany();
    await Admin.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('Merimaa@1979', salt);

    const adminUser = {
      name: 'Krushnakant Rutele',
      email: 'krushnakantrutele1979@gmail.com',
      passwordHash: passwordHash,
    };

    await Admin.create(adminUser);

    const sampleProjects = [
      {
        title: 'Full-Stack LMS Platform',
        slug: 'full-stack-lms-platform',
        shortDescription: 'A comprehensive Learning Management System for modern education.',
        fullDescription: 'This Learning Management System (LMS) provides a complete digital classroom experience. It allows instructors to create courses, upload materials, and manage students. Students can enroll in courses, track progress, and submit assignments. Built with a robust MERN stack and secure JWT authentication.',
        technologies: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS'],
        category: 'Full-Stack',
        coverImage: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=1000',
        screenshots: [],
        githubUrl: 'https://github.com/yourusername/lms',
        liveUrl: 'https://lms-demo.example.com',
        featured: true,
        displayOrder: 1,
        challenges: 'Implementing robust role-based access control and handling large video file uploads efficiently.',
        outcome: 'Successfully deployed a scalable platform capable of handling 1000+ concurrent users with 99.9% uptime.'
      },
      {
        title: 'Cross-Platform E-Commerce App',
        slug: 'cross-platform-ecommerce',
        shortDescription: 'A beautiful and performant mobile application for online shopping.',
        fullDescription: 'A fully functional mobile e-commerce application developed with Flutter. Features include product browsing, search, shopping cart, and a simulated checkout process. Data is managed in real-time using Firebase Firestore, with Firebase Auth for user management.',
        technologies: ['Flutter', 'Dart', 'Firebase', 'State Management'],
        category: 'Mobile App',
        coverImage: 'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?auto=format&fit=crop&q=80&w=1000',
        screenshots: [],
        githubUrl: 'https://github.com/yourusername/ecommerce-app',
        liveUrl: '',
        featured: true,
        displayOrder: 2,
        challenges: 'Managing complex app state across multiple screens and ensuring smooth animations on low-end devices.',
        outcome: 'Achieved a near-native performance 60fps experience on both iOS and Android platforms.'
      },
      {
        title: 'Real-Time Collaboration Board',
        slug: 'real-time-collaboration-board',
        shortDescription: 'An interactive whiteboarding tool for remote teams.',
        fullDescription: 'A real-time collaborative workspace where multiple users can draw, add sticky notes, and plan together. Built with Next.js on the frontend and powered by WebSockets for instant syncing between clients.',
        technologies: ['Next.js', 'WebSockets', 'Tailwind CSS', 'Node.js'],
        category: 'Frontend',
        coverImage: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=1000',
        screenshots: [],
        githubUrl: 'https://github.com/yourusername/collab-board',
        liveUrl: 'https://collab-board.example.com',
        featured: false,
        displayOrder: 3,
        challenges: 'Handling concurrent state mutations from multiple users without conflict.',
        outcome: 'Created a seamless, lag-free collaborative experience with conflict-resolution strategies.'
      }
    ];

    await Project.insertMany(sampleProjects);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error with seed: ${error}`);
    process.exit(1);
  }
};

importData();
