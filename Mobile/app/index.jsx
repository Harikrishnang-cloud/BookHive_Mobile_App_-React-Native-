import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, ScrollView, Image, SafeAreaView, Dimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { logout } from '../src/services/auth.service';
import { useWishlist } from '../src/context/WishlistContext';

const { width } = Dimensions.get('window');

const CATEGORIES = ['Popular','Fiction','Technology','Science','Business','Self Help','Biography','Education','Mystery','Romance'];
const NEW_BOOKS = [
  { id: '1', title: 'Harry Potter', price: '₹105.77', image: 'https://m.media-amazon.com/images/I/81q77Q39nEL._AC_UF1000,1000_QL80_.jpg' },
  { id: '2', title: "Don't Make me think", price: '₹235.17', image: 'https://m.media-amazon.com/images/I/81q77Q39nEL._AC_UF1000,1000_QL80_.jpg' },
  { id: '3', title: 'Harry Potter', price: '₹105.77', image: 'https://m.media-amazon.com/images/I/81q77Q39nEL._AC_UF1000,1000_QL80_.jpg' },
  { id: '4', title: "Don't Make me think", price: '₹235.17', image: 'https://m.media-amazon.com/images/I/81q77Q39nEL._AC_UF1000,1000_QL80_.jpg' },

];

const OLD_BOOKS = [
  { id: '1', title: 'Python Programming', price: '₹105.77', image: 'https://m.media-amazon.com/images/I/81q77Q39nEL._AC_UF1000,1000_QL80_.jpg' },
  { id: '2', title: 'Effective Java', price: '₹477.23', image: 'https://m.media-amazon.com/images/I/81q77Q39nEL._AC_UF1000,1000_QL80_.jpg' },
  { id: '3', title: 'Python Programming', price: '₹105.77', image: 'https://m.media-amazon.com/images/I/81q77Q39nEL._AC_UF1000,1000_QL80_.jpg' },
  { id: '4', title: 'Effective Java', price: '₹477.23', image: 'https://m.media-amazon.com/images/I/81q77Q39nEL._AC_UF1000,1000_QL80_.jpg' },
];

export default function Home() {
  const router = useRouter();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [activeCategory, setActiveCategory] = useState('Popular');
  const [searchQuery, setSearchQuery] = useState('');
  const filteredNewBooks = NEW_BOOKS.filter(book => book.title.toLowerCase().includes(searchQuery.toLowerCase()));  
  const filteredOldBooks = OLD_BOOKS.filter(book => book.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out', error);
    }
  };

  const renderBookCard = (book) => (
    <View key={book.id} style={styles.bookCard}>
      <Pressable 
        style={[styles.bookmarkBadge, isInWishlist(book.id) && styles.bookmarkBadgeActive]}
        onPress={() => toggleWishlist(book)}
      >
        <Ionicons name={isInWishlist(book.id) ? "bookmark" : "bookmark-outline"} size={16} color={isInWishlist(book.id) ? "#0e6b56" : "#fff"} />
      </Pressable>
      <Image source={{ uri: book.image }} style={styles.bookImage} resizeMode="contain" />
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle} numberOfLines={1}>{book.title}</Text>
        <Text style={styles.bookPrice}>Price: <Text style={styles.priceBold}>{book.price}</Text></Text>
        <Pressable style={styles.addToCartBtn}>
          <Text style={styles.addToCartText}>Add to cart</Text>
          <Ionicons name="cart-outline" size={18} color="#0e6b56" />
        </Pressable>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Pressable>
            <Ionicons name="menu-outline" size={32} color="#999" />
          </Pressable>
          <View style={styles.headerRight}>
            <Pressable style={styles.headerIcon} onPress={() => router.push('/wishlist')}>
              <Ionicons name="bookmark-outline" size={26} color="#333" />
            </Pressable>
            <Pressable style={styles.headerIcon}>
              <Ionicons name="notifications-outline" size={26} color="#333" />
            </Pressable>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput 
            style={styles.searchInput} 
            placeholder="Search your books..." 
            placeholderTextColor="#999" 
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Ionicons name="search-outline" size={22} color="#0e6b56" style={styles.searchIcon} />
        </View>

        {/* Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer} contentContainerStyle={styles.categoriesContent}>
          {CATEGORIES.map(category => (
            <Pressable
              key={category}
              style={[
                styles.categoryPill,
                activeCategory === category && styles.categoryPillActive
              ]}
              onPress={() => setActiveCategory(category)}
            >
              <Text style={[styles.categoryText,
              activeCategory === category && styles.categoryTextActive
              ]}>
                {category}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* New Book Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>New Book</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.bookListContent}>
            {filteredNewBooks.map(renderBookCard)}
            {filteredNewBooks.length === 0 && <Text style={{color: '#999', marginVertical: 20}}>No new books found.</Text>}
          </ScrollView>
        </View>

        {/* Old Book Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Old Book</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.bookListContent}>
            {filteredOldBooks.map(renderBookCard)}
            {filteredOldBooks.length === 0 && <Text style={{color: '#999', marginVertical: 20}}>No old books found.</Text>}
          </ScrollView>
        </View>

        {/* Padding for bottom tab bar */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Tab Bar */}
      <View style={styles.bottomTabBar}>
        <Pressable style={styles.tabItem}>
          <Ionicons name="home-outline" size={24} color="#0e6b56" />
          <Text style={styles.tabText}>Home</Text>
        </Pressable>

        {/* Floating Action Button for Upload */}
        <View style={styles.fabWrapper}>
          <Pressable style={styles.fab}>
            <View style={styles.fabIconContainer}>
              <Ionicons name="add" size={32} color="#0e6b56" />
            </View>
          </Pressable>
          <Text style={styles.fabText}>Upload</Text>
        </View>

        {/* Tapping Profile logs out for now to ensure we don't lose that functionality */}
        <Pressable style={styles.tabItem} onPress={handleLogout}>
          <Ionicons name="person-outline" size={24} color="#999" />
          <Text style={styles.tabTextIdle}>Profile</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginLeft: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#0e6b56',
    borderRadius: 8,
    marginHorizontal: 20,
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 25,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  searchIcon: {
    marginLeft: 10,
  },
  categoriesContainer: {
    marginBottom: 25,
  },
  categoriesContent: {
    paddingHorizontal: 20,
    gap: 2,
  },
  categoryPill: {
    borderWidth: 1.5,
    borderColor: '#0e6b56',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 18,
    marginRight: 10,
  },
  categoryPillActive: {
    backgroundColor: '#0e6b56',
  },
  categoryText: {
    color: '#0e6b56',
    fontSize: 14,
    fontWeight: '600',
  },
  categoryTextActive: {
    color: '#fff',
  },
  sectionContainer: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#666',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  bookListContent: {
    paddingHorizontal: 20,
    gap: 5,
  },
  bookCard: {
    width: width * 0.42,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#fff',
    marginRight: 15,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  bookmarkBadge: {
    position: 'absolute',
    top: -1,
    right: 15,
    backgroundColor: '#0e6b56',
    width: 28,
    height: 38,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  bookmarkBadgeActive: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#0e6b56',
    borderTopWidth: 0,
  },
  bookImage: {
    width: '100%',
    height: 130,
    marginBottom: 10,
    marginTop: 15,
  },
  bookInfo: {
    flex: 1,
  },
  bookTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
    fontWeight: '500',
  },
  bookPrice: {
    fontSize: 12,
    color: '#999',
    marginBottom: 10,
  },
  priceBold: {
    fontWeight: 'bold',
    color: '#333',
    fontSize: 14,
  },
  addToCartBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#0e6b56',
    borderRadius: 6,
    paddingVertical: 8,
    gap: 5,
  },
  addToCartText: {
    color: '#0e6b56',
    fontSize: 12,
    fontWeight: '600',
  },
  bottomTabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingHorizontal: 10,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
  },
  tabText: {
    color: '#0e6b56',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '700',
  },
  tabTextIdle: {
    color: '#999',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },
  fabWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    top: -25,
  },
  fab: {
    width: 65,
    height: 65,
    backgroundColor: '#d6eee8',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '45deg' }],
  },
  fabIconContainer: {
    transform: [{ rotate: '-45deg' }],
  },
  fabText: {
    color: '#0e6b56',
    fontSize: 13,
    marginTop: 22,
    fontWeight: '700',
  }
});
