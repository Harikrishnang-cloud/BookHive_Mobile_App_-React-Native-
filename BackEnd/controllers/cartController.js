const { db } = require('../config/firebase');

// Fetch user's cart
const getCart = async (req, res) => {
  try {
    const { uid } = req.user;
    const cartRef = db.collection('carts').doc(uid).collection('items');
    const snapshot = await cartRef.get();
    
    if (snapshot.empty) {
      return res.status(200).json([]);
    }
    
    const cartItems = [];
    for (const doc of snapshot.docs) {
      const itemData = doc.data();
      // Fetch book details securely from books collection
      const bookRef = db.collection('books').doc(itemData.bookId);
      const bookDoc = await bookRef.get();
      
      if (bookDoc.exists) {
        const bookData = bookDoc.data();
        cartItems.push({
          id: doc.id,
          bookId: itemData.bookId,
          quantity: itemData.quantity,
          // Merge book details for frontend
          title: bookData.title,
          price: bookData.price,
          image: bookData.image,
          stock: bookData.stock
        });
      }
    }
    
    return res.status(200).json(cartItems);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Add to cart
const addToCart = async (req, res) => {
  try {
    const { uid } = req.user;
    const { bookId, quantity = 1 } = req.body;

    if (!bookId || quantity <= 0) {
      return res.status(400).json({ message: 'Invalid bookId or quantity' });
    }

    // Secure verification: Check if book exists and has enough stock
    const bookRef = db.collection('books').doc(bookId);
    const bookDoc = await bookRef.get();
    
    if (!bookDoc.exists) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    const bookData = bookDoc.data();
    if (bookData.stock < quantity) {
      return res.status(400).json({ message: 'Not enough stock available' });
    }

    const itemRef = db.collection('carts').doc(uid).collection('items').doc(bookId);
    const itemDoc = await itemRef.get();
    
    let newQuantity = quantity;
    if (itemDoc.exists) {
      newQuantity += itemDoc.data().quantity;
      if (bookData.stock < newQuantity) {
        return res.status(400).json({ message: 'Cannot add more, exceeds stock' });
      }
      await itemRef.update({ quantity: newQuantity });
    } else {
      await itemRef.set({ bookId, quantity });
    }

    res.status(200).json({ message: 'Item added to cart', bookId, quantity: newQuantity });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update cart item quantity
const updateCartItem = async (req, res) => {
  try {
    const { uid } = req.user;
    const { bookId } = req.params;
    const { quantity } = req.body;

    if (quantity === undefined || quantity < 0) {
      return res.status(400).json({ message: 'Invalid quantity' });
    }

    const itemRef = db.collection('carts').doc(uid).collection('items').doc(bookId);
    
    if (quantity === 0) {
      await itemRef.delete();
      return res.status(200).json({ message: 'Item removed from cart' });
    }

    // Verify stock
    const bookRef = db.collection('books').doc(bookId);
    const bookDoc = await bookRef.get();
    
    if (!bookDoc.exists) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    if (bookDoc.data().stock < quantity) {
      return res.status(400).json({ message: 'Not enough stock available' });
    }

    await itemRef.set({ bookId, quantity }, { merge: true });
    res.status(200).json({ message: 'Cart updated', bookId, quantity });
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
  try {
    const { uid } = req.user;
    const { bookId } = req.params;

    const itemRef = db.collection('carts').doc(uid).collection('items').doc(bookId);
    await itemRef.delete();
    
    res.status(200).json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart };
