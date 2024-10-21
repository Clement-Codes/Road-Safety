import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Dimensions, Text, PermissionsAndroid, Platform, Alert, Image } from 'react-native';
import MapView, { Polyline, Marker, Callout  } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import * as Location from 'expo-location';
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';
import { images } from '../constants'

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const origin = { latitude: 37.78825, longitude: -122.4324 };
const destination = { latitude: 37.7749, longitude: -122.4194 };


  const Map = ({ risk, severity }) => {
    const [region, setRegion] = useState(null);
    const [roadCoordinates, setRoadCoordinates] = useState([]);
    const [snappedLocation, setSnappedLocation] = useState(null);
    const [userLocation, setUserLocation] = useState({ latitude: null, longitude: null });
    const username = "User";

    useEffect(() => {
      (async () => {
        // Ask for user location permission
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.log('Permission to access location was denied');
          return;
        }
  
        // Get the current location
        let location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
        setUserLocation({ latitude, longitude });
        // Set the map region
        setRegion({
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.003,  // Decrease for more zoom
          longitudeDelta: 0.003, // Decrease for more zoom
        });
  
        // Fetch the nearest road from OpenStreetMap using Overpass API
        fetchRoadFromOSM(latitude, longitude);
      })();
    }, []);
  
    // Function to query Overpass API for road data
    const fetchRoadFromOSM = async (latitude, longitude) => {
      try {
        const overpassURL = `https://overpass-api.de/api/interpreter?data=[out:json];way(around:50,${latitude},${longitude})["highway"];out geom;`;
  
        const response = await fetch(overpassURL);
        const data = await response.json();
  
        if (data && data.elements && data.elements.length > 0) {
          // Get the first road element from the response
          const road = data.elements[0];
  
          if (road && road.geometry) {
            const coordinates = road.geometry.map((point) => ({
              latitude: point.lat,
              longitude: point.lon,
            }));
  
            setRoadCoordinates(coordinates); // Set the road's full geometry
  
            // Snap the user location to the nearest point on the road
            const snappedPoint = snapToRoad(latitude, longitude, coordinates);
            setSnappedLocation(snappedPoint);
          }
        }
      } catch (error) {
        console.error('Error fetching road from Overpass API:', error);
      }
    };
  
    // Function to find the nearest point on the road to the user's location
    const snapToRoad = (userLat, userLon, roadCoordinates) => {
      let closestPoint = null;
      let minDistance = Infinity;
  
      roadCoordinates.forEach((roadPoint) => {
        const distance = getDistance(userLat, userLon, roadPoint.latitude, roadPoint.longitude);
        if (distance < minDistance) {
          minDistance = distance;
          closestPoint = roadPoint;
        }
      });
  
      return closestPoint;
    };
  
    // Haversine formula to calculate distance between two lat/lon points
    const getDistance = (lat1, lon1, lat2, lon2) => {
      const R = 6371e3; // Radius of the Earth in meters
      const φ1 = (lat1 * Math.PI) / 180;
      const φ2 = (lat2 * Math.PI) / 180;
      const Δφ = ((lat2 - lat1) * Math.PI) / 180;
      const Δλ = ((lon2 - lon1) * Math.PI) / 180;
  
      const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
      const distance = R * c; // Distance in meters
      return distance;
    };
  
    return (
      <View style={styles.container}>
        {region && (
          <MapView
            style={styles.map}
            initialRegion={region}
            showsUserLocation={false}
            customMapStyle={darkMapStyle} 
          >
            {roadCoordinates.length > 0 && (
              <Polyline
                coordinates={roadCoordinates}
                strokeColor={severity == 0?"#006f3c":severity == 1?"#264b96":"#bf212f"}
                strokeWidth={5}
              />
            )}
  
            {snappedLocation && (
              <Marker coordinate={snappedLocation} anchor={{ x: 0.5, y: 0.5 }}>
                <Image
                  source={images.car} // Path to car marker image
                  style={{ width: 40, height: 40 }}
                  resizeMode="contain"
                />
              </Marker>
            )}
          </MapView>
        )}
      {userLocation.latitude && userLocation.longitude && (
        <View style={styles.bottomInfo}>
          <Text style={styles.infoText}>Road Risk: {severity?"Yes":"No"} (Yes / No)</Text>
          <Text style={styles.infoText}>
            Road Severity: {severity == 0?"Low":severity == 1?"Medium":"High"}  (Low - High)
          </Text>
        </View>
      )}
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    map: {
      width: width,  
      height: height * 0.4,
      borderRadius: 50,
    },
    bottomInfo: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
      padding: 30,
      alignItems: 'center',
    },
    infoText: {
      color: '#fff',
      fontSize: 16,
    },
  });
  
  // Black/Dark Mode Map Style (Google Maps-like)
  const darkMapStyle = [
    {
      elementType: 'geometry',
      stylers: [{ color: '#212121' }],
    },
    {
      elementType: 'labels.icon',
      stylers: [{ visibility: 'off' }],
    },
    {
      elementType: 'labels.text.fill',
      stylers: [{ color: '#757575' }],
    },
    {
      elementType: 'labels.text.stroke',
      stylers: [{ color: '#212121' }],
    },
    {
      featureType: 'administrative',
      elementType: 'geometry',
      stylers: [{ color: '#757575' }],
    },
    {
      featureType: 'administrative.country',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#9e9e9e' }],
    },
    {
      featureType: 'administrative.land_parcel',
      stylers: [{ visibility: 'off' }],
    },
    {
      featureType: 'administrative.locality',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#bdbdbd' }],
    },
    {
      featureType: 'poi',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#757575' }],
    },
    {
      featureType: 'poi.park',
      elementType: 'geometry',
      stylers: [{ color: '#181818' }],
    },
    {
      featureType: 'poi.park',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#616161' }],
    },
    {
      featureType: 'poi.park',
      elementType: 'labels.text.stroke',
      stylers: [{ color: '#1b1b1b' }],
    },
    {
      featureType: 'road',
      elementType: 'geometry.fill',
      stylers: [{ color: '#2c2c2c' }],
    },
    {
      featureType: 'road',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#8a8a8a' }],
    },
    {
      featureType: 'road.arterial',
      elementType: 'geometry',
      stylers: [{ color: '#373737' }],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry',
      stylers: [{ color: '#3c3c3c' }],
    },
    {
      featureType: 'road.highway.controlled_access',
      elementType: 'geometry',
      stylers: [{ color: '#4e4e4e' }],
    },
    {
      featureType: 'road.local',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#616161' }],
    },
    {
      featureType: 'transit',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#757575' }],
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{ color: '#000000' }],
    },
    {
      featureType: 'water',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#3d3d3d' }],
    },
  ];
  //   const styles = StyleSheet.create({
  //   container: {
  //     flex: 1,
  //   },
  //   map: {
  //     width: width,  
  //     height: height * 0.4,  
  //   },
  // });

    //   <View style={styles.container}>
    //     <MapView
    //       style={styles.map}
    //       customMapStyle={mapStyle}
    //       initialRegion={{
    //         latitude: origin.latitude,
    //         longitude: origin.longitude,
    //         latitudeDelta: 0.0922,
    //         longitudeDelta: 0.0421,
    //       }}
    //     >
    //       {/* Markers for origin and destination */}
    //       <Marker coordinate={origin} />
    //       <Marker coordinate={destination} />
  
    //       {/* Draw the route */}
    //       <MapViewDirections
    //         origin={origin}
    //         destination={destination}
    //         apikey={GOOGLE_MAPS_APIKEY}
    //         strokeWidth={3}
    //         strokeColor="hotpink"
    //       />
    //     </MapView>
    //   </View>

  

export default Map