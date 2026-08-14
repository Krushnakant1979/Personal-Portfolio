const bcrypt = require('bcrypt');
const { db } = require('./src/config/db');

const seedAdmin = async () => {
  try {
    const email = 'krushnakantrutele1979@gmail.com';
    const password = 'password123'; // Temporary password
    
    // Check if exists
    const adminsRef = db.collection('admins');
    const snapshot = await adminsRef.where('email', '==', email).limit(1).get();
    
    if (!snapshot.empty) {
      console.log('Admin user already exists in Firebase!');
      process.exit(0);
    }
    
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    
    await adminsRef.add({
      name: 'Krushnakant Rutele',
      email,
      passwordHash
    });
    
    console.log('Successfully seeded admin user into Firebase Firestore!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
