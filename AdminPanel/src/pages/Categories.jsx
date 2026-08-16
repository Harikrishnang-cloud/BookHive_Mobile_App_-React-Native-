import React, { useEffect, useState } from 'react';
import api from '../config/api';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', order: 0, isActive: true, type: 'main', icon: '', image: '' });

  const fetchCategories = async () => {
    try {
      const response = await api.get('/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/api/admin/categories/${editingId}`, formData);
      } else {
        await api.post('/api/admin/categories', formData);
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({ name: '', order: 0, isActive: true, type: 'main', icon: '', image: '' });
      fetchCategories();
    } catch (error) {
      console.error('Failed to save category', error);
      alert('Error saving category');
    }
  };

  const handleEdit = (category) => {
    setFormData({ 
      name: category.name, 
      order: category.order || 0, 
      isActive: category.isActive !== false, 
      type: category.type || 'main',
      icon: category.icon || '',
      image: category.image || ''
    });
    setEditingId(category.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await api.delete(`/api/admin/categories/${id}`);
      fetchCategories();
    } catch (error) {
      console.error('Failed to delete category', error);
      alert('Error deleting category');
    }
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600 }}>Manage Categories</h2>
        <button 
          className="btn-primary" 
          style={{ display: 'flex', alignItems: 'center', gap: 8 }}
          onClick={() => { setShowForm(!showForm); setEditingId(null); setFormData({ name: '', order: 0, isActive: true, type: 'main', icon: '', image: '' }); }}
        >
          <Plus size={18} /> {showForm ? 'Cancel' : 'Add Category'}
        </button>
      </div>

      {showForm && (
        <div style={{ backgroundColor: 'var(--bg-color)', padding: 20, borderRadius: 8, marginBottom: 20 }}>
          <h3 style={{ marginBottom: 15, fontWeight: 600 }}>{editingId ? 'Edit Category' : 'Create New Category'}</h3>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 5 }}>Name</label>
              <input type="text" className="input-field" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 5 }}>Type</label>
              <select className="input-field" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                <option value="main">Main Category</option>
                <option value="trending">Trending Category</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 5 }}>Icon Name (e.g., 'school')</label>
              <input type="text" className="input-field" value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 5 }}>Order</label>
              <input type="number" className="input-field" value={formData.order} onChange={e => setFormData({...formData, order: parseInt(e.target.value) || 0})} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 15 }}>
              <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} />
              <label>Active (Visible to users)</label>
            </div>
            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn-primary">Save Category</button>
            </div>
          </form>
        </div>
      )}

      {loading ? <p>Loading...</p> : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Name</th>
              <th>Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(category => (
              <tr key={category.id}>
                <td>{category.order}</td>
                <td style={{ fontWeight: 500 }}>{category.name}</td>
                <td style={{ textTransform: 'capitalize' }}>{category.type || 'main'}</td>
                <td>
                  <span style={{ padding: '4px 8px', borderRadius: 4, backgroundColor: category.isActive !== false ? '#dcfce7' : '#fee2e2', color: category.isActive !== false ? '#166534' : '#991b1b', fontSize: 12, fontWeight: 600 }}>
                    {category.isActive !== false ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => handleEdit(category)} style={{ color: '#3b82f6' }}><Edit2 size={18} /></button>
                  <button onClick={() => handleDelete(category.id)} style={{ color: 'var(--danger)' }}><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No categories found.</td></tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Categories;
