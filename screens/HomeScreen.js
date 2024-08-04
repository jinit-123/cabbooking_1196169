// screens/HomeScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function HomeScreen({ navigation }) {
  const [cabs, setCabs] = useState([]);

  useEffect(() => {
    const fetchCabs = async () => {
      const querySnapshot = await getDocs(collection(db, 'cabs'));
      const cabsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCabs(cabsData);
    };

    fetchCabs();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={cabs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.cabCard}
            onPress={() => navigation.navigate('CabDetail', { cab: item })}
          >
            <View>
              <Text style={styles.companyName}>{item.companyName}</Text>
              <Text style={styles.carModel}>{item.carModel}</Text>
            </View>
          </TouchableOpacity>
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
