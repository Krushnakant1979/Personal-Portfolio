const Contact = require('../models/Contact');

// @desc    Get all contact submissions
// @route   GET /api/contact
// @access  Private
const getContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find({}).sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a contact submission
// @route   POST /api/contact
// @access  Public
const createContact = async (req, res, next) => {
  try {
    const { name, email, subject, message, honeypot } = req.body;
    
    // Simple honeypot check to prevent basic spam bots
    if (honeypot) {
      return res.status(400).json({ message: 'Spam detected' });
    }

    const contact = new Contact({
      name,
      email,
      subject,
      message,
    });

    const createdContact = await contact.save();
    res.status(201).json(createdContact);
  } catch (error) {
    next(error);
  }
};

// @desc    Update contact status
// @route   PATCH /api/contact/:id
// @access  Private
const updateContactStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const contact = await Contact.findById(req.params.id);

    if (contact) {
      contact.status = status || contact.status;
      const updatedContact = await contact.save();
      res.json(updatedContact);
    } else {
      res.status(404);
      throw new Error('Contact submission not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a contact submission
// @route   DELETE /api/contact/:id
// @access  Private
const deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (contact) {
      await contact.deleteOne();
      res.json({ message: 'Message deleted' });
    } else {
      res.status(404);
      throw new Error('Contact submission not found');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getContacts,
  createContact,
  updateContactStatus,
  deleteContact,
};
