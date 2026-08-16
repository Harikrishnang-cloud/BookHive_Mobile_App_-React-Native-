import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Image, SafeAreaView, Dimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useWishlist } from '../src/context/WishlistContext';

const { width } = Dimensions.get('window');

export default function Wishlist() {
  const router = useRouter();
  const { wishlist, removeFromWishlist } = useWishlist();

  const formattedDate = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const renderWishlistItem = (book) => (
    <View key={book.id} style={styles.wishlistCard}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: book.image }} style={styles.bookImage} resizeMode="contain" />
      </View>

      <View style={styles.bookDetails}>
        <Text style={styles.bookTitle} numberOfLines={1}>{book.title}</Text>
        <Text style={styles.bookPrice}>Price: <Text style={styles.priceBold}>{book.price}</Text></Text>
        <Pressable style={styles.addToCartBtn}>
          <Text style={styles.addToCartText}>Add to cart</Text>
        </Pressable>
      </View>

      <View style={styles.actionButtons}>
        <Pressable style={styles.iconButton}>
          <Ionicons name="share-social-outline" size={22} color="#666" />
        </Pressable>
        <Pressable style={styles.iconButton} onPress={() => removeFromWishlist(book.id)}>
          <Ionicons name="trash-outline" size={22} color="#666" />
        </Pressable>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#333" />
        </Pressable>
        <Text style={styles.headerTitle}>My Wishlist</Text>
        <View style={{ width: 28 }} /> {/* Placeholder to balance the flex layout */}
      </View>

      {/* Summary Row */}
      <View style={styles.summaryRow}>
        <Ionicons name="lock-closed-outline" size={16} color="#666" />
        <Text style={styles.summaryText}>
          {wishlist.length} items | {formattedDate}
        </Text>
      </View>

      {/* Book List */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {wishlist.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="bookmarks-outline" size={60} color="#ddd" style={{ marginBottom: 15 }} />
            <Text style={styles.emptyText}>Your wishlist is empty</Text>
            <Text style={styles.emptySubtext}>Save books you want to read later!</Text>
            <Pressable style={styles.exploreBtn} onPress={() => router.replace('/')}>
              <Text style={styles.exploreBtnText}>Explore Books</Text>
            </Pressable>
          </View>
        ) : (
          wishlist.map(renderWishlistItem)
        )}
        <View style={{ height: 100 }} /> {/* Padding for bottom tab bar */}
      </ScrollView>

      {/* Bottom Tab Bar (Duplicated from Home for UI consistency) */}
      <View style={styles.bottomTabBar}>
        <Pressable style={styles.tabItem} onPress={() => router.replace('/')}>
          <Ionicons name="home-outline" size={24} color="#999" />
          <Text style={styles.tabTextIdle}>Home</Text>
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

        <Pressable style={styles.tabItem} onPress={() => router.push('/profile')}>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 15,
  },
  backButton: {
    padding: 5,
    marginLeft: -5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  summaryText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
    fontWeight: '500',
  },
  scrollContent: {
    paddingHorizontal: 15,
    gap: 15,
  },
  wishlistCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  imageContainer: {
    backgroundColor: '#e6f5f3',
    borderRadius: 5,
    padding: 5,
    marginRight: 15,
    width: 80,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookImage: {
    width: '100%',
    height: '100%',
  },
  bookDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  bookTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  bookPrice: {
    fontSize: 13,
    color: '#666',
    marginBottom: 10,
  },
  priceBold: {
    fontWeight: 'bold',
    color: '#333',
  },
  addToCartBtn: {
    backgroundColor: '#0e6b56',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  addToCartText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  actionButtons: {
    justifyContent: 'space-between',
    paddingVertical: 5,
    paddingLeft: 10,
  },
  iconButton: {
    padding: 5,
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
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  exploreBtn: {
    backgroundColor: '#0e6b56',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  exploreBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  }
});
