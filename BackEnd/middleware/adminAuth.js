const { auth, db } = require('../config/firebase');

const verifyAdminToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decodedToken = await auth.verifyIdToken(token);
    
    // For admin access, we either check custom claims or an "admins" collection
    // We'll check the 'admins' collection in Firestore
    const adminRef = db.collection('admins').doc(decodedToken.uid);
    const adminDoc = await adminRef.get();

    if (!adminDoc.exists) {
      return res.status(403).json({ message: 'Forbidden: Admin access required' });
    }

    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Error verifying admin token:', error);
    return res.status(403).json({ message: 'Unauthorized: Invalid or expired token' });
  }
};

module.exports = { verifyAdminToken };
