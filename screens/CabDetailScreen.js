// screens/CabDetailScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import { collection, getDocs, query, where, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function CabDetailScreen({ route, navigation }) {
  const { cab } = route.params;
  const [totalBookings, setTotalBookings] = useState(0);
  const [specificCabBookings, setSpecificCabBookings] = useState(0);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const userBookingsQuery = query(
          collection(db, 'bookings'),
          where('userId', '==', 'currentUserId') 
        );
        const userBookingsSnapshot = await getDocs(userBookingsQuery);
        setTotalBookings(userBookingsSnapshot.size);

        const cabBookingsQuery = query(
          collection(db, 'bookings'),
          where('userId', '==', 'currentUserId'),
          where('cabId', '==', cab.id)
        );
        const cabBookingsSnapshot = await getDocs(cabBookingsQuery);
        setSpecificCabBookings(cabBookingsSnapshot.size);
      } catch (error) {
        console.error('Error fetching bookings: ', error);
      }
    };

    fetchBookings();
  }, []);

  const handleBookCab = async () => {
    if (totalBookings >= 2) {
      Alert.alert('Booking Limit Reached', 'You cannot book more than 2 cabs at a time.');
      return;
    }

    if (specificCabBookings >= 2) {
      Alert.alert('Cab Booking Limit Reached', 'You cannot book the same cab more than 2 times.');
      return;
    }

    try {
      await addDoc(collection(db, 'bookings'), {
        cabId: cab.id,
        companyName: cab.companyName,
        carModel: cab.carModel,
        userId: 'currentUserId', 
        timestamp: new Date(), 
      });

      setTotalBookings(totalBookings + 1);
      setSpecificCabBookings(specificCabBookings + 1);

      Alert.alert('Success', 'Cab booked successfully!');
      navigation.navigate('My Cab');
    } catch (error) {
      Alert.alert('Error', 'Failed to book the cab. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.detailsCard}>
        <Text style={styles.title}>{cab.companyName}</Text>
        <Text style={styles.detail}>Model: {cab.carModel}</Text>
        <Text style={styles.detail}>Passengers: {cab.passengerCount}</Text>
        <Text style={styles.detail}>Rating: {cab.rating}</Text>
        <Text style={styles.detail}>Cost/Hour: ${cab.costPerHour}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Book Cab" onPress={handleBookCab} color="#ff5c5c" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  detailsCard: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  detail: {
    fontSize: 18,
    color: '#666',
    marginVertical: 5,
  },
  buttonContainer: {
    marginTop: 20,
  },
});
