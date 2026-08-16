const { db } = require('../config/firebase');

const getDashboardStats = async (req, res) => {
  try {
    const booksSnapshot = await db.collection('books').get();
    const categoriesSnapshot = await db.collection('categories').get();
    const usersSnapshot = await db.collection('users').get();
    const ordersSnapshot = await db.collection('orders').get();

    const totalBooks = booksSnapshot.size;
    const totalCategories = categoriesSnapshot.size;
    const totalUsers = usersSnapshot.size;
    const totalOrders = ordersSnapshot.size;

    let pendingOrders = 0;
    let completedOrders = 0;
    let totalSales = 0;

    ordersSnapshot.forEach(doc => {
      const order = doc.data();
      if (order.status === 'Pending') pendingOrders++;
      if (order.status === 'Delivered' || order.status === 'Completed') completedOrders++;
      totalSales += order.totalAmount || 0;
    });

    // Low stock books
    const lowStockBooks = [];
    booksSnapshot.forEach(doc => {
      const book = doc.data();
      if (book.stock !== undefined && book.stock < 10) {
        lowStockBooks.push({ id: doc.id, ...book });
      }
    });

    res.status(200).json({
      totalBooks,
      totalCategories,
      totalUsers,
      totalOrders,
      pendingOrders,
      completedOrders,
      totalSales,
      lowStockBooks: lowStockBooks.slice(0, 5),
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { getDashboardStats };
