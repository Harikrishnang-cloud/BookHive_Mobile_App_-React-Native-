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

const createBook = async (req, res) => {
  try {
    const bookData = req.body;
    bookData.createdAt = new Date().toISOString();
    
    const docRef = await db.collection('books').add(bookData);
    return res.status(201).json({ id: docRef.id, ...bookData });
  } catch (error) {
    console.error('Error creating book:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const docRef = db.collection('books').doc(id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    updates.updatedAt = new Date().toISOString();
    await docRef.update(updates);
    
    return res.status(200).json({ id, ...doc.data(), ...updates });
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('books').doc(id).delete();
    return res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { getAllBooks, getBookById, createBook, updateBook, deleteBook };
