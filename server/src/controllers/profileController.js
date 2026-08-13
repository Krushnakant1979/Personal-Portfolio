const Profile = require('../models/Profile');

// @desc    Get profile data
// @route   GET /api/profile
// @access  Public
const getProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne();
    
    // If no profile exists, create a default one
    if (!profile) {
      profile = await Profile.create({
        email: 'krushnakantrutele1979@gmail.com',
        phone: '+91 8530604630',
        github: 'https://github.com/krushnakantrutele',
        linkedin: 'https://linkedin.com/in/krushnakantrutele',
        instagram: '',
        resume: '',
        about: ''
      });
    }
    
    let profileData = profile.toJSON();
    if (profileData.resume && profileData.resume.endsWith('.pdf') && profileData.resume.includes('cloudinary') && !profileData.resume.includes('fl_attachment')) {
      profileData.resume = profileData.resume.replace('/upload/', '/upload/fl_attachment/');
    }
    
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
    
    let profile = await Profile.findOne();
    
    if (profile) {
      // Update existing profile
      profile.email = email !== undefined ? email : profile.email;
      profile.phone = phone !== undefined ? phone : profile.phone;
      profile.github = github !== undefined ? github : profile.github;
      profile.linkedin = linkedin !== undefined ? linkedin : profile.linkedin;
      profile.instagram = instagram !== undefined ? instagram : profile.instagram;
      profile.resume = resume !== undefined ? resume : profile.resume;
      profile.about = about !== undefined ? about : profile.about;
      
      const updatedProfile = await profile.save();
      let profileData = updatedProfile.toJSON();
      if (profileData.resume && profileData.resume.endsWith('.pdf') && profileData.resume.includes('cloudinary') && !profileData.resume.includes('fl_attachment')) {
        profileData.resume = profileData.resume.replace('/upload/', '/upload/fl_attachment/');
      }
      res.json(profileData);
    } else {
      // Create new profile if it doesn't exist
      profile = await Profile.create({
        email,
        phone,
        github,
        linkedin,
        instagram,
        resume,
        about
      });
      let profileData = profile.toJSON();
      if (profileData.resume && profileData.resume.endsWith('.pdf') && profileData.resume.includes('cloudinary') && !profileData.resume.includes('fl_attachment')) {
        profileData.resume = profileData.resume.replace('/upload/', '/upload/fl_attachment/');
      }
      res.status(201).json(profileData);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getProfile,
  updateProfile
};
