const { db } = require('./config/firebase');

const books = [
  {
    title: 'Harry Potter',
    author: 'J.K. Rowling',
    price: 105.77,
    image: 'https://m.media-amazon.com/images/I/81q77Q39nEL._AC_UF1000,1000_QL80_.jpg',
    category: 'Popular',
    stock: 50,
    condition: 'New'
  },
  {
    title: "Don't Make me think",
    author: 'Steve Krug',
    price: 235.17,
    image: 'https://m.media-amazon.com/images/I/81q77Q39nEL._AC_UF1000,1000_QL80_.jpg',
    category: 'Technology',
    stock: 20,
    condition: 'New'
  },
  {
    title: 'Python Programming',
    author: 'John Doe',
    price: 105.77,
    image: 'https://m.media-amazon.com/images/I/81q77Q39nEL._AC_UF1000,1000_QL80_.jpg',
    category: 'Technology',
    stock: 15,
    condition: 'Old'
  },
  {
    title: 'Effective Java',
    author: 'Joshua Bloch',
    price: 477.23,
    image: 'https://m.media-amazon.com/images/I/81q77Q39nEL._AC_UF1000,1000_QL80_.jpg',
    category: 'Technology',
    stock: 5,
    condition: 'Old'
  }
];

async function seed() {
  try {
    const batch = db.batch();
    const booksRef = db.collection('books');
    
    // Quick check if already seeded
    const snapshot = await booksRef.limit(1).get();
    if (!snapshot.empty) {
      console.log('Books collection already has data. Skipping seed.');
      process.exit(0);
    }
    
    books.forEach(book => {
      const docRef = booksRef.doc();
      batch.set(docRef, { ...book, createdAt: new Date().toISOString() });
    });

    await batch.commit();
    console.log('Books seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding books:', error);
    process.exit(1);
  }
}

seed();
