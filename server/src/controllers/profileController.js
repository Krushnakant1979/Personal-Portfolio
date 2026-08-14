const Profile = require('../models/Profile');

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
        about: '',
      });
    }

    const profileData = profile.toJSON();
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

    // Use findOneAndUpdate for a single round-trip instead of fetch → mutate → save
    const updated = await Profile.findOneAndUpdate(
      {},
      { $set: { email, phone, github, linkedin, instagram, resume, about } },
      { new: true, upsert: true, runValidators: true }
    );

    const profileData = updated.toJSON();
    profileData.resume = formatResumeUrl(profileData.resume);

    res.json(profileData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getProfile, updateProfile };
