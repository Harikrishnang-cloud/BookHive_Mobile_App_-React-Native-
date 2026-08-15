const { db } = require('../config/firebase');

const syncUser = async (req, res) => {
  try {
    const { uid, email } = req.user;
    const { name } = req.body;
    
    const userRef = db.collection('users').doc(uid);
    const doc = await userRef.get();
    
    if (!doc.exists) {
      await userRef.set({
        uid,
        name: name || '',
        email: email || '',
        role: 'user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return res.status(201).json({ message: 'User created successfully', uid });
    } else {
      await userRef.update({
        updatedAt: new Date().toISOString()
      });
      return res.status(200).json({ message: 'User synced successfully', uid });
    }
  } catch (error) {
    console.error('Error syncing user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { syncUser };
