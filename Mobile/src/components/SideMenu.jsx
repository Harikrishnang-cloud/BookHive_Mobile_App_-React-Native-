import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions, Platform, Modal, ScrollView, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function SideMenu({ visible, onClose, router, handleLogout }) {
  const [showModal, setShowModal] = useState(visible);
  const slideAnim = useRef(new Animated.Value(-width * 0.75)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setShowModal(true);
      Animated.parallel([
        Animated.timing(slideAnim, { 
          toValue: 0, 
          duration: 450, 
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true 
        }),
        Animated.timing(fadeAnim, { 
          toValue: 1, 
          duration: 450, 
          useNativeDriver: true 
        })
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, { 
          toValue: -width * 0.75, 
          duration: 400, 
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true 
        }),
        Animated.timing(fadeAnim, { 
          toValue: 0, 
          duration: 400, 
          useNativeDriver: true 
        })
      ]).start(() => {
        setShowModal(false);
      });
    }
  }, [visible]);

  const navigateAndClose = (path) => {
    onClose();
    setTimeout(() => {
      router.push(path);
    }, 150);
  };

  return (
    <Modal visible={showModal} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <Animated.View style={[styles.modalBackdrop, { opacity: fadeAnim }]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        </Animated.View>
        <Animated.View style={[styles.sideMenu, { transform: [{ translateX: slideAnim }] }]}>
          <View style={styles.menuHeader}>
            <Text style={styles.menuHeaderText}>Menu</Text>
            <Pressable onPress={onClose}>
              <Ionicons name="close" size={28} color="#333" />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
            <Pressable style={styles.menuItem} onPress={() => navigateAndClose('/profile')}>
              <Ionicons name="person-outline" size={24} color="#555" />
              <Text style={styles.menuItemText}>Profile</Text>
            </Pressable>

            <Pressable style={styles.menuItem} onPress={() => navigateAndClose('/orders')}>
              <Ionicons name="receipt-outline" size={24} color="#555" />
              <Text style={styles.menuItemText}>My Orders</Text>
            </Pressable>

            <Pressable style={styles.menuItem} onPress={() => navigateAndClose('/cart')}>
              <Ionicons name="cart-outline" size={24} color="#555" />
              <Text style={styles.menuItemText}>My Cart</Text>
            </Pressable>

            <Pressable style={styles.menuItem} onPress={() => navigateAndClose('/wishlist')}>
              <Ionicons name="heart-outline" size={24} color="#555" />
              <Text style={styles.menuItemText}>My Wishlist</Text>
            </Pressable>

            <Pressable style={styles.menuItem} onPress={() => navigateAndClose('/address')}>
              <Ionicons name="location-outline" size={24} color="#555" />
              <Text style={styles.menuItemText}>My Address</Text>
            </Pressable>

            <View style={styles.menuDivider} />

            <Pressable style={styles.menuItem} onPress={() => navigateAndClose('/notifications')}>
              <Ionicons name="notifications-outline" size={24} color="#555" />
              <Text style={styles.menuItemText}>Notifications</Text>
            </Pressable>

            <Pressable style={styles.menuItem} onPress={() => navigateAndClose('/offers')}>
              <Ionicons name="pricetag-outline" size={24} color="#555" />
              <Text style={styles.menuItemText}>Offers & Coupons</Text>
            </Pressable>

            <Pressable style={styles.menuItem} onPress={() => navigateAndClose('/settings')}>
              <Ionicons name="settings-outline" size={24} color="#555" />
              <Text style={styles.menuItemText}>Settings</Text>
            </Pressable>

            <Pressable style={styles.menuItem} onPress={() => navigateAndClose('/support')}>
              <Ionicons name="help-circle-outline" size={24} color="#555" />
              <Text style={styles.menuItemText}>Help & Support</Text>
            </Pressable>

            <Pressable style={styles.menuItem} onPress={() => navigateAndClose('/about')}>
              <Ionicons name="information-circle-outline" size={24} color="#555" />
              <Text style={styles.menuItemText}>About Us</Text>
            </Pressable>

            <View style={styles.menuDivider} />

            <Pressable style={styles.menuItem} onPress={() => navigateAndClose('/change-password')}>
              <Ionicons name="lock-closed-outline" size={24} color="#555" />
              <Text style={styles.menuItemText}>Change Password</Text>
            </Pressable>

            <Pressable style={styles.menuItem} onPress={() => { onClose(); handleLogout(); }}>
              <Ionicons name="log-out-outline" size={24} color="#d9534f" />
              <Text style={[styles.menuItemText, { color: '#d9534f' }]}>Logout</Text>
            </Pressable>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sideMenu: {
    width: width * 0.75,
    backgroundColor: '#fff',
    height: '100%',
    paddingTop: Platform.OS === 'android' ? 40 : 50,
    paddingHorizontal: 20,
    position: 'absolute',
    left: 0,
    top: 0,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  menuHeaderText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0e6b56',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
    fontWeight: '500',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 10,
  },
});
