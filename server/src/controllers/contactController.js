const { db, FieldValue } = require('../config/db');

// Helper to format Firestore docs
const formatDoc = (doc) => ({ _id: doc.id, ...doc.data() });

// @desc    Get all contact submissions
// @route   GET /api/contact
// @access  Private
const getContacts = async (req, res, next) => {
  try {
    const snapshot = await db.collection('contacts').get();
    let contacts = [];
    snapshot.forEach(doc => {
      contacts.push(formatDoc(doc));
    });
    
    // Sort by createdAt descending
    contacts.sort((a, b) => {
      const timeA = a.createdAt ? (a.createdAt.toMillis ? a.createdAt.toMillis() : new Date(a.createdAt).getTime()) : 0;
      const timeB = b.createdAt ? (b.createdAt.toMillis ? b.createdAt.toMillis() : new Date(b.createdAt).getTime()) : 0;
      return timeB - timeA;
    });

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

    const newContact = {
      name,
      email,
      subject,
      message,
      status: 'unread',
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    };
    
    const docRef = await db.collection('contacts').add(newContact);
    const doc = await docRef.get();
    
    res.status(201).json(formatDoc(doc));
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
    const docRef = db.collection('contacts').doc(req.params.id);
    const doc = await docRef.get();
    
    if (doc.exists) {
      const updates = {
        updatedAt: FieldValue.serverTimestamp()
      };
      if (status) updates.status = status;
      
      await docRef.update(updates);
      const updatedDoc = await docRef.get();
      res.json(formatDoc(updatedDoc));
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
    const docRef = db.collection('contacts').doc(req.params.id);
    const doc = await docRef.get();
    
    if (doc.exists) {
      await docRef.delete();
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
