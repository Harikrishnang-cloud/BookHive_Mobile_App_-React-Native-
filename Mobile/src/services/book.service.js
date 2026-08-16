const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';

export const getBooks = async () => {
  const response = await fetch(`${apiUrl}/api/books`);
  if (!response.ok) {
    throw new Error('Failed to fetch books');
  }
  return response.json();
};

export const getBookById = async (id) => {
  const response = await fetch(`${apiUrl}/api/books/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch book');
  }
  return response.json();
};

export const getCategories = async () => {
  const response = await fetch(`${apiUrl}/api/categories`);
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }
  return response.json();
};
