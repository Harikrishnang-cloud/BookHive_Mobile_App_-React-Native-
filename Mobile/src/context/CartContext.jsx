import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import * as cartService from '../services/cart.service';

export const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { firebaseUser } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCart = async () => {
    if (!firebaseUser) {
      setCartItems([]);
      return;
    }
    setLoading(true);
    try {
      const items = await cartService.getCart();
      setCartItems(items);
      setError(null);
    } catch (err) {
      setError('Failed to fetch cart items');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [firebaseUser]);

  const addToCart = async (book, quantity = 1) => {
    if (!firebaseUser) return;
    try {
      // Backend handles validation, we just send bookId and quantity
      await cartService.addToCart(book.id || book.bookId, quantity);
      await fetchCart(); // Refresh cart to get updated state from backend
    } catch (err) {
      console.error('Error adding to cart:', err);
      throw err;
    }
  };

  const updateQuantity = async (bookId, quantity) => {
    if (!firebaseUser) return;
    try {
      await cartService.updateCartItem(bookId, quantity);
      await fetchCart();
    } catch (err) {
      console.error('Error updating cart quantity:', err);
      throw err;
    }
  };

  const removeFromCart = async (bookId) => {
    if (!firebaseUser) return;
    try {
      await cartService.removeFromCart(bookId);
      await fetchCart();
    } catch (err) {
      console.error('Error removing from cart:', err);
      throw err;
    }
  };

  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartItemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider 
      value={{ 
        cartItems, 
        loading, 
        error, 
        cartTotal,
        cartItemCount,
        addToCart, 
        updateQuantity, 
        removeFromCart,
        fetchCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
