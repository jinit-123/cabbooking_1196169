// screens/MyCabScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, Alert, StyleSheet } from 'react-native';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function MyCabScreen() {
  const [bookedCabs, setBookedCabs] = useState([]);

  useEffect(() => {
    const fetchBookedCabs = async () => {
      const querySnapshot = await getDocs(collection(db, 'bookings'));
      const bookingsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setBookedCabs(bookingsData);
    };

    fetchBookedCabs();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    try {
      await deleteDoc(doc(db, 'bookings', bookingId));
      setBookedCabs(bookedCabs.filter((cab) => cab.id !== bookingId));
      Alert.alert('Success', 'Booking cancelled successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to cancel the booking. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={bookedCabs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.cabCard}>
            <Text style={styles.companyName}>{item.companyName}</Text>
            <Text style={styles.carModel}>{item.carModel}</Text>
            <Button
              title="Cancel Booking"
              onPress={() => handleCancelBooking(item.id)}
              color="#ff5c5c"
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  cabCard: {
    padding: 15,
    marginVertical: 10,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  carModel: {
    fontSize: 16,
    color: '#666',
  },
});
