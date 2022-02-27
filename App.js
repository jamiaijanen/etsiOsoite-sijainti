import React, { useState, useEffect } from 'react';
import { StyleSheet, StatusBar, View, Button, TextInput, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

export default function App() {
  
  const [region, setRegion] = useState({latitude: 0, longitude: 0, latitudeDelta: 0.0322, longitudeDelta: 0.0221});
  const [marker, setMarker] = useState({latitude: 0, longitude: 0});
  const [address, setAddress] = useState('');

  const find = () => {
    fetch(`http://www.mapquestapi.com/geocoding/v1/address?key=GkEqJLn1cPA00uh3KiwTnq4L0DtqJuGS&location=${address}`)
    .then(res => res.json())
    .then(json => json.results[0].locations[0].latLng)
    .then(latLng => {
      setRegion({ ...region, latitude: latLng.lat, longitude: latLng.lng });
      setMarker({ latitude: latLng.lat, longitude: latLng.lng });
    })
    .catch(error => {
      Alert.alert('Error', error)
    })
  }

    useEffect(() => (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('No permission to get location')
        return;
      }

      let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      let longitude = location.coords.longitude
      let latitude = location.coords.latitude
      setRegion({ latitude, longitude, latitudeDelta: 0.0322, longitudeDelta: 0.0221 })
      setMarker({ latitude, longitude })
    })(), []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}>
        <Marker
          coordinate={marker}
          title={address} />
      </MapView>
      <TextInput style={styles.textfield} onChangeText={ address => setAddress(address) } />
      <Button onPress={find} title='Show' />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: StatusBar.currentHeight,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  textfield: {
    borderBottomWidth: 1,
    width: "100%",
    marginBottom: 10
  }
});
