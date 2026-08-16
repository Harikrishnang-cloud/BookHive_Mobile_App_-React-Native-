import React, { useEffect, useState } from 'react';
import api from '../config/api';
import { Plus, Edit2, Trash2, Image as ImageIcon } from 'lucide-react';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: '', author: '', price: 0, stock: 0, category: 'Popular', condition: 'New', image: '', isActive: true });

  const fetchBooks = async () => {
    try {
      const response = await api.get('/api/books');
      setBooks(response.data);
    } catch (error) {
      console.error('Failed to fetch books', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/api/admin/books/${editingId}`, formData);
      } else {
        await api.post('/api/admin/books', formData);
      }
      setShowForm(false);
      setEditingId(null);
      fetchBooks();
    } catch (error) {
      console.error('Failed to save book', error);
      alert('Error saving book');
    }
  };

  const handleEdit = (book) => {
    setFormData({ 
      title: book.title, 
      author: book.author, 
      price: book.price, 
      stock: book.stock || 0,
      category: book.category,
      condition: book.condition,
      image: book.image || '',
      isActive: book.isActive !== false
    });
    setEditingId(book.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    try {
      await api.delete(`/api/admin/books/${id}`);
      fetchBooks();
    } catch (error) {
      console.error('Failed to delete book', error);
      alert('Error deleting book');
    }
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600 }}>Manage Books</h2>
        <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}onClick={() => { setShowForm(!showForm); setEditingId(null); setFormData({ title: '', author: '', price: 0, stock: 0, category: 'Popular', condition: 'New', image: '', isActive: true }); }}>
          <Plus size={18} /> {showForm ? 'Cancel' : 'Add Book'}
        </button>
      </div>

      {showForm && (
        <div style={{ backgroundColor: 'var(--bg-color)', padding: 20, borderRadius: 8, marginBottom: 20 }}>
          <h3 style={{ marginBottom: 15, fontWeight: 600 }}>{editingId ? 'Edit Book' : 'Add New Book'}</h3>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
            <div><label style={{ display: 'block', marginBottom: 5 }}>Title</label><input type="text" className="input-field" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required /></div>
            <div><label style={{ display: 'block', marginBottom: 5 }}>Author</label><input type="text" className="input-field" value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} required /></div>
            <div><label style={{ display: 'block', marginBottom: 5 }}>Price (₹)</label><input type="number" step="0.01" className="input-field" value={formData.price} onChange={e => setFormData({...formData, price: parseFloat(e.target.value) || 0})} required /></div>
            <div><label style={{ display: 'block', marginBottom: 5 }}>Stock</label><input type="number" className="input-field" value={formData.stock} onChange={e => setFormData({...formData, stock: parseInt(e.target.value) || 0})} required /></div>
            <div><label style={{ display: 'block', marginBottom: 5 }}>Category</label><input type="text" className="input-field" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required /></div>
            <div>
              <label style={{ display: 'block', marginBottom: 5 }}>Condition</label>
              <select className="input-field" value={formData.condition} onChange={e => setFormData({...formData, condition: e.target.value})}>
                <option value="New">New</option>
                <option value="Old">Old</option>
              </select>
            </div>
            <div style={{ gridColumn: '1 / -1' }}><label style={{ display: 'block', marginBottom: 5 }}>Image URL</label><input type="text" className="input-field" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} /></div>
            
            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
              <button type="submit" className="btn-primary">Save Book</button>
            </div>
          </form>
        </div>
      )}

      {loading ? <p>Loading...</p> : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Author</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map(book => (
              <tr key={book.id}>
                <td>{book.image ? <img src={book.image} alt="book" style={{ width: 40, height: 60, objectFit: 'cover', borderRadius: 4 }} /> : <ImageIcon color="#ccc" />}</td>
                <td style={{ fontWeight: 500 }}>{book.title}</td>
                <td>{book.author}</td>
                <td>₹{book.price}</td>
                <td>
                  <span style={{ color: book.stock < 10 ? 'var(--danger)' : 'inherit', fontWeight: book.stock < 10 ? 'bold' : 'normal' }}>
                    {book.stock}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={() => handleEdit(book)} style={{ color: '#3b82f6' }}><Edit2 size={18} /></button>
                    <button onClick={() => handleDelete(book.id)} style={{ color: 'var(--danger)' }}><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Books;
