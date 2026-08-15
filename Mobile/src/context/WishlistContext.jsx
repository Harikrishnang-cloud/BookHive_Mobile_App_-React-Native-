import React, { createContext, useState, useContext } from 'react';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  const addToWishlist = (book) => {
    setWishlist((prevWishlist) => {
      // Check if book already exists
      const exists = prevWishlist.find(item => item.id === book.id);
      if (exists) return prevWishlist;
      return [...prevWishlist, book];
    });
  };

  const removeFromWishlist = (bookId) => {
    setWishlist((prevWishlist) => prevWishlist.filter(book => book.id !== bookId));
  };

  const toggleWishlist = (book) => {
    setWishlist((prevWishlist) => {
      const exists = prevWishlist.find(item => item.id === book.id);
      if (exists) {
        return prevWishlist.filter(item => item.id !== book.id);
      }
      return [...prevWishlist, book];
    });
  };

  const isInWishlist = (bookId) => {
    return wishlist.some(book => book.id === bookId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  return useContext(WishlistContext);
};
