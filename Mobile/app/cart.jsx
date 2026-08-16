import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, Image, Pressable, ActivityIndicator, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCart } from '../src/context/CartContext';

export default function Cart() {
  const router = useRouter();
  const { cartItems, loading, error, cartTotal, updateQuantity, removeFromCart } = useCart();
  const handleIncrease = (item) => {
    // If backend returns an error (e.g. stock exceeded), we catch it to alert the user
    updateQuantity(item.bookId, item.quantity + 1).catch(e => {
      Alert.alert("Cannot Update", e.message || "Not enough stock available.");
    });
  };

  const handleDecrease = (item) => {
    if (item.quantity > 1) {
      updateQuantity(item.bookId, item.quantity - 1);
    } else {
      removeFromCart(item.bookId);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.image }} style={styles.itemImage} resizeMode="contain" />
      <View style={styles.itemDetails}>
        <Text style={styles.itemTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.itemPrice}>₹{item.price}</Text>
        
        <View style={styles.quantityContainer}>
          <Pressable style={styles.qtyButton} onPress={() => handleDecrease(item)}>
            <Ionicons name="remove" size={18} color="#0e6b56" />
          </Pressable>
          <Text style={styles.qtyText}>{item.quantity}</Text>
          <Pressable style={styles.qtyButton} onPress={() => handleIncrease(item)}>
            <Ionicons name="add" size={18} color="#0e6b56" />
          </Pressable>
        </View>
      </View>
      <Pressable style={styles.removeBtn} onPress={() => removeFromCart(item.bookId)}>
        <Ionicons name="trash-outline" size={24} color="#d9534f" />
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={28} color="#333" />
        </Pressable>
        <Text style={styles.headerTitle}>My Cart</Text>
        <View style={{ width: 28 }} />
      </View>

      {error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : loading && cartItems.length === 0 ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#0e6b56" />
        </View>
      ) : cartItems.length === 0 ? (
        <View style={styles.centerContainer}>
          <Ionicons name="cart-outline" size={80} color="#ddd" />
          <Text style={styles.emptyText}>Your cart is empty.</Text>
          <Pressable style={styles.exploreBtn} onPress={() => router.push('/')}>
            <Text style={styles.exploreBtnText}>Explore Books</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <FlatList data={cartItems} keyExtractor={item => item.bookId}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}/>
          
          <View style={styles.footer}>
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Subtotal:</Text>
              <Text style={styles.totalAmount}>₹{cartTotal.toFixed(2)}</Text>
            </View>
            <Pressable style={styles.checkoutBtn} onPress={() => router.push('/checkout')}>
              <Text style={styles.checkoutBtnText}>Proceed to Checkout</Text>
            </Pressable>
          </View>
        </>
      )}
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
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  backBtn: {
    padding: 5,
    marginLeft: -5,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    marginTop: 15,
    marginBottom: 25,
  },
  exploreBtn: {
    backgroundColor: '#0e6b56',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  exploreBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: '#d9534f',
    fontSize: 16,
  },
  listContainer: {
    padding: 20,
  },
  cartItem: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    alignItems: 'center'
  },
  itemImage: {
    width: 70,
    height: 100,
    marginRight: 15,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'space-between',
    height: 90,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0e6b56',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#f6f5f5ff',
    alignSelf: 'flex-start',
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 3,
  },
  qtyButton: {
    padding: 5,
  },
  qtyText: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 15,
    color: '#333',
  },
  removeBtn: {
    padding: 10,
  },
  footer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  totalLabel: {
    fontSize: 18,
    color: '#666',
    fontWeight: '500',
  },
  totalAmount: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0e6b56',
  },
  checkoutBtn: {
    backgroundColor: '#0e6b56',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
  },
  checkoutBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  }
});
