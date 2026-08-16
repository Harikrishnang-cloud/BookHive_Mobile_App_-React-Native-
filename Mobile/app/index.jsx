import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, ScrollView, FlatList, Image, SafeAreaView, Dimensions, Platform, Animated, Easing, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { logout } from '../src/services/auth.service';
import { useWishlist } from '../src/context/WishlistContext';
import { useCart } from '../src/context/CartContext';
import { getBooks, getCategories } from '../src/services/book.service';
import SideMenu from '../src/components/SideMenu';
const { width } = Dimensions.get('window');

// Dynamic categories are now loaded from the backend

export default function Home() {
  const router = useRouter();
  const { toggleWishlist, isInWishlist, wishlist } = useWishlist();
  const { cartItems, addToCart, cartItemCount } = useCart();
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState(['Popular', 'Fiction', 'Technology']);
  const [trendingCategories, setTrendingCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Popular');
  const [searchQuery, setSearchQuery] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const unreadNotifications = 3; // Mock value for unread notifications
  const trendingListRef = useRef(null);
  const scrollOffset = useRef(0);
  const isScrolling = useRef(true);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (isScrolling.current && trendingListRef.current) {
        scrollOffset.current += 1.5; // Slower, smoother speed
        
        // 7 items * (150 width + 12 marginRight) = 1134 width per full set
        if (scrollOffset.current >= 1134) {
           scrollOffset.current = 0;
           trendingListRef.current.scrollToOffset({ offset: 0, animated: false });
        } else {
           trendingListRef.current.scrollToOffset({ offset: scrollOffset.current, animated: false });
        }
      }
    }, 19); // ~60 FPS

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getBooks();
        setBooks(data);
        
        const cats = await getCategories();
        const mainCats = cats.filter(c => c.type === 'main' && c.isActive).map(c => c.name);
        if (mainCats.length > 0) {
          setCategories(mainCats);
          setActiveCategory(mainCats[0]);
        }
        
        const trendCats = cats.filter(c => c.type === 'trending' && c.isActive);
        setTrendingCategories(trendCats);
      } catch (error) {
        console.error('Failed to fetch data', error);
      }
    };
    fetchData();
  }, []);

  const filteredNewBooks = books.filter(book => book.condition === 'New' && book.title.toLowerCase().includes(searchQuery.toLowerCase()));  
  const filteredOldBooks = books.filter(book => book.condition === 'Old' && book.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out', error);
    }
  };

  const renderBookCard = (book) => {
    const isBookInCart = cartItems.some(item => item.bookId === book.id);
    
    return (
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
          <Text style={styles.bookPrice}>Price: <Text style={styles.priceBold}>₹{book.price}</Text></Text>
          <Pressable 
            style={[styles.addToCartBtn, isBookInCart && styles.addToCartBtnActive]} 
            onPress={() => isBookInCart ? router.push('/cart') : addToCart(book, 1)}
          >
            <Text style={[styles.addToCartText, isBookInCart && styles.addToCartTextActive]}>
              {isBookInCart ? "Go to cart" : "Add to cart"}
            </Text>
            <Ionicons 
              name={isBookInCart ? "arrow-forward-outline" : "cart-outline"} 
              size={18} 
              color={isBookInCart ? "#fff" : "#0e6b56"} 
            />
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <SideMenu 
        visible={menuVisible} 
        onClose={() => setMenuVisible(false)} 
        router={router} 
        handleLogout={handleLogout} 
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => setMenuVisible(true)}>
            <Ionicons name="menu-outline" size={32} color="#999" />
          </Pressable>
          <View style={styles.headerRight}>
            <Pressable style={styles.headerIcon} onPress={() => router.push('/wishlist')}>
              <Ionicons name="bookmark-outline" size={26} color="#333" />
              {wishlist.length > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{wishlist.length}</Text>
                </View>
              )}
            </Pressable>
            <Pressable style={styles.headerIcon}>
              <Ionicons name="notifications-outline" size={26} color="#333" />
              {unreadNotifications > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{unreadNotifications}</Text>
                </View>
              )}
            </Pressable>
          </View>
        </View>

        {/* Search Bar and Cart */}
        <View style={styles.searchRow}>
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
          <Pressable style={styles.cartIconWrapper} onPress={() => router.push('/cart')}>
            <Ionicons name="cart-outline" size={28} color="#333" />
            {cartItemCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartItemCount}</Text>
              </View>
            )}
          </Pressable>
        </View>

        {/* Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer} contentContainerStyle={styles.categoriesContent}>
          {categories.map(category => (
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

        {/* Trending Categories Section */}
        {trendingCategories.length > 0 && (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Trending Categories</Text>
          <FlatList
            ref={trendingListRef}
            data={[...trendingCategories, ...trendingCategories, ...trendingCategories]} // Triple to ensure seamless looping
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.trendingContent}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            scrollEnabled={true}
            onScrollBeginDrag={() => { isScrolling.current = false; }} // Pause on drag
            onScrollEndDrag={() => { isScrolling.current = true; }}    // Resume after drag
            renderItem={({ item: category }) => (
              <Pressable 
                style={styles.trendingCard}
                onPress={() => console.log('Clicked', category.title)} // Retains clickability
              >
                <ImageBackground source={{ uri: category.image || 'https://via.placeholder.com/150' }} style={styles.trendingImage} imageStyle={{ borderRadius: 10 }}>
                  <View style={styles.trendingTextOverlay}>
                    <Text style={styles.trendingTitle}>{category.name}</Text>
                    <Text style={styles.trendingSub} numberOfLines={1}>{category.icon || 'Category'}</Text>
                  </View>
                </ImageBackground>
              </Pressable>
            )}
          />
        </View>
        )}

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
        <Pressable style={styles.tabItem}>
          <Ionicons name="book-outline" size={24} color="#999" />
          <Text style={styles.tabTextIdle}>My Books</Text>
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

        <Pressable style={ styles.tabItem}>
          <Ionicons name="list-outline" size={24} color="#999" />
          <Text style={styles.tabTextIdle}>Category</Text>
        </Pressable>

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
    position: 'relative',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 25,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#0e6b56',
    borderRadius: 8,
    paddingHorizontal: 15,
    height: 50,
  },
  cartIconWrapper: {
    marginLeft: 15,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#d9534f',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
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
  trendingContent: {
    paddingHorizontal: 20,
    gap: 0,
  },
  trendingCard: {
    width: 150,
    height: 190,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 4,
    borderRadius:10,
  },
  trendingImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  trendingTextOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    padding: 8,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  trendingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  trendingSub: {
    fontSize: 12,
    color: '#e0e0e0',
    fontWeight: '500',
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
  addToCartBtnActive: {
    backgroundColor: '#0e6b56',
  },
  addToCartText: {
    color: '#0e6b56',
    fontSize: 12,
    fontWeight: '600',
  },
  addToCartTextActive: {
    color: '#fff',
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
