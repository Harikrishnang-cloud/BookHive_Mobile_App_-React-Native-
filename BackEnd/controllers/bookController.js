const { db } = require('../config/firebase');

const getAllBooks = async (req, res) => {
  try {
    const booksRef = db.collection('books');
    const snapshot = await booksRef.get();
    
    if (snapshot.empty) {return res.status(200).json([]);}
    
    const books = [];
    snapshot.forEach(doc => {books.push({ id: doc.id, ...doc.data() });});
    return res.status(200).json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getBookById = async (req, res) => {
  try {
    const { id } = req.params;
    const bookRef = db.collection('books').doc(id);
    const doc = await bookRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    return res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error('Error fetching book:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { getAllBooks, getBookById };
