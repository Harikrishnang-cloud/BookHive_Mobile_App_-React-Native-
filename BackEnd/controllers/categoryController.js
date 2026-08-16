const { db } = require('../config/firebase');

const getAllCategories = async (req, res) => {
  try {
    const snapshot = await db.collection('categories').orderBy('order', 'asc').get();
    
    if (snapshot.empty) {
      return res.status(200).json([]);
    }
    
    const categories = [];
    snapshot.forEach(doc => {
      categories.push({ id: doc.id, ...doc.data() });
    });
    
    return res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, icon, image, order, isActive, type } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const newCategory = {
      name,
      icon: icon || null,
      image: image || null,
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true,
      type: type || 'main', // 'main' or 'trending'
      createdAt: new Date().toISOString()
    };

    const docRef = await db.collection('categories').add(newCategory);
    return res.status(201).json({ id: docRef.id, ...newCategory });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const docRef = db.collection('categories').doc(id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    updates.updatedAt = new Date().toISOString();
    await docRef.update(updates);
    
    return res.status(200).json({ id, ...doc.data(), ...updates });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('categories').doc(id).delete();
    return res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { getAllCategories, createCategory, updateCategory, deleteCategory };
