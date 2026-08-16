import React, { useEffect, useState } from 'react';
import api from '../config/api';
// import { Book, Users, ShoppingBag, Tags } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/api/admin/dashboard');
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;
  if (!stats) return <div>Failed to load stats.</div>;

  const statCards = [
    { title: 'Total Books', value: stats.totalBooks },
    { title: 'Total Categories', value: stats.totalCategories },
    { title: 'Total Users', value: stats.totalUsers },
    { title: 'Total Orders', value: stats.totalOrders },
  ];

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24, marginBottom: 30 }}>
        {statCards.map(card => (
          <div key={card.title} className="card" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: 14, fontWeight: 500 }}>{card.title}</p>
              <h3 style={{ fontSize: 24, fontWeight: 'bold', color: 'var(--text-main)', marginTop: 4 }}>
                {card.value}
              </h3>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div className="card">
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20 }}>Sales Overview</h3>
          <div style={{ padding: 20, backgroundColor: 'var(--bg-color)', borderRadius: 8, display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: 'var(--text-muted)' }}>Total Sales</p>
              <h2 style={{ fontSize: 28, color: 'var(--primary)', fontWeight: 'bold' }}>₹{stats.totalSales.toFixed(2)}</h2>
            </div>
            <div>
              <p style={{ color: 'var(--text-muted)' }}>Pending Orders</p>
              <h2 style={{ fontSize: 28, color: '#f59e0b', fontWeight: 'bold' }}>{stats.pendingOrders}</h2>
            </div>
            <div>
              <p style={{ color: 'var(--text-muted)' }}>Completed</p>
              <h2 style={{ fontSize: 28, color: '#10b981', fontWeight: 'bold' }}>{stats.completedOrders}</h2>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20, color: 'var(--danger)' }}>Low Stock Alert</h3>
          {stats.lowStockBooks.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>All books are well stocked.</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Book</th>
                  <th>Stock</th>
                </tr>
              </thead>
              <tbody>
                {stats.lowStockBooks.map(book => (
                  <tr key={book.id}>
                    <td>{book.title}</td>
                    <td style={{ color: 'var(--danger)', fontWeight: 'bold' }}>{book.stock} left</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
