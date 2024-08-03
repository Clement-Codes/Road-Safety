import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Gyroscope } from 'expo-sensors';
import DataRow from './DataRow';

const Distraction =  () => {
  const [{ x, y, z }, setData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });
  const [subscription, setSubscription] = useState(null);

  Gyroscope.setUpdateInterval(1000);

  const _subscribe = () => {
    setSubscription(
      Gyroscope.addListener(gyroscopeData => {
        setData(gyroscopeData);
      })
    );
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  useEffect(() => {
    _subscribe();
    return () => _unsubscribe();
  }, []);

  const [result, setResult] = useState('');

  const labelPitch = (pitch) => {
    if (-0.50 < pitch && pitch < 0.50) return 0;
    if (pitch <= -0.50) return 1;
    if (pitch >= 0.50) return 2;
    return null;
  };

  const labelRoll = (roll) => {
    if (-1.00 < roll && roll < 1.00) return 0;
    if (roll <= -1.0) return 1;
    if (roll >= 1.0) return 2;
    return null;
  };

  const labelYaw = (yaw) => {
    if (-1.0 < yaw && yaw < 1.0) return 0;
    if (yaw < -1.0) return 1;
    if (yaw > 1.0) return 2;
    return null;
  };

  const outputLabel = (pitchLabel, rollLabel, yawLabel) => {
    if (pitchLabel === 1) {
      return (rollLabel === 0 && yawLabel === 0) ? 'Phone On Stand' : 'Distracted';
    } else if (pitchLabel === 0) {
      return (rollLabel === 1 && yawLabel === 1) ? 'Distracted' : 'Tilted';
    } else {
      if (rollLabel === 0) return 'Phone On Stand';
      if (rollLabel === 1) return 'Phone tilted Left';
      return 'Phone tilted Right';
    }
  };

  useEffect(() => {
    const pitchLabel = labelPitch(x);
    const rollLabel = labelRoll(y);
    const yawLabel = labelYaw(z);
    const output = outputLabel(pitchLabel, rollLabel, yawLabel);
    setResult(output);
  }, [x, y, z]);

  return (
    <View >
                  <View className="bg-black-100 rounded-2xl border-2 border-black-200 rounded-lg p-4 my-2">
                    <Text className="text-xl font-bold mb-4 text-center text-white">Distraction Data</Text>
                    <View>
                      <DataRow title="Orientation" value={result} />
                    </View>
                  </View>
    </View>
  );
}
export default Distraction
