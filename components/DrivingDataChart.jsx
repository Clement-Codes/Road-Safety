import React from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

const DrivingDataChart = ({ latestData }) => {
  // Data for the bar chart
  const data = {
    labels: [
      "Harsh Braking", 
      "Over Speeding", 
      "Over Speeding Score", 
      "Time Driving", 
      "Weather Score", 
      "Violations Score", 
      "Risk Score"
    ],
    datasets: [
      {
        data: [
          latestData.harsh_braking,
          latestData.over_speeding,
          latestData.over_speeding_score,
          latestData.time_of_driving_score,
          latestData.weather_condition_score,
          latestData.prolong_violations_score,
          latestData.risk_score
        ]
      }
    ]
  };

  return (
    <View style={styles.container}>
      <BarChart
        data={data}
        width={Dimensions.get('window').width - 30} // Adjust for padding
        height={250} // Increased height for better clarity
        yAxisLabel=""
        chartConfig={{
          backgroundColor: '#ffffff',  // White background
          backgroundGradientFrom: '#f0f0f0',  // Light gray gradient start
          backgroundGradientTo: '#ffffff',  // White background gradient end
          decimalPlaces: 0, // No decimal places for whole numbers
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,  // Bars in black
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,  // Black labels
          style: {
            borderRadius: 16,  // Round the edges
            borderWidth: 1,  // Add border for clarity
            borderColor: '#000',  // Black border color
          },
          propsForLabels: {
            fontSize: 12,  // Increase label font size
            fontWeight: 'bold',  // Make labels bold
          },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#000',  // Dot stroke in black (for other chart types)
          },
        }}
        verticalLabelRotation={45}  // Rotate labels for better readability
        fromZero={true}  // Ensure chart starts from zero
      />
    </View>
  );
};

// Styles for the container
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
});

export default DrivingDataChart;
