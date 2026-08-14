const { db } = require('../config/db');

/**
 * Rewrites Cloudinary PDF URLs to include the fl_attachment flag,
 * so the browser downloads instead of previewing the resume.
 */
const formatResumeUrl = (url) => {
  if (url && url.endsWith('.pdf') && url.includes('cloudinary') && !url.includes('fl_attachment')) {
    return url.replace('/upload/', '/upload/fl_attachment/');
  }
  return url;
};

// Helper to format Firestore docs
const formatDoc = (doc) => ({ _id: doc.id, ...doc.data() });

// @desc    Get profile data
// @route   GET /api/profile
// @access  Public
const getProfile = async (req, res) => {
  try {
    const docRef = db.collection('profile').doc('main_profile');
    const doc = await docRef.get();

    let profileData = {};

    if (!doc.exists) {
      // If no profile exists, create a default one
      profileData = {
        email: 'krushnakantrutele1979@gmail.com',
        phone: '+91 8530604630',
        github: 'https://github.com/krushnakantrutele',
        linkedin: 'https://linkedin.com/in/krushnakantrutele',
        instagram: '',
        resume: '',
        about: '',
      };
      await docRef.set(profileData);
      profileData._id = 'main_profile';
    } else {
      profileData = formatDoc(doc);
    }

    profileData.resume = formatResumeUrl(profileData.resume);
    res.json(profileData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update profile data
// @route   PUT /api/profile
// @access  Private (Admin)
const updateProfile = async (req, res) => {
  try {
    const { email, phone, github, linkedin, instagram, resume, about } = req.body;

    const docRef = db.collection('profile').doc('main_profile');
    const updateData = { email, phone, github, linkedin, instagram, resume, about };
    
    // Remove undefined values to avoid overwriting with null unintentionally, though set(merge:true) handles it
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    await docRef.set(updateData, { merge: true });
    
    const updatedDoc = await docRef.get();
    const profileData = formatDoc(updatedDoc);
    
    profileData.resume = formatResumeUrl(profileData.resume);
    res.json(profileData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getProfile, updateProfile };
