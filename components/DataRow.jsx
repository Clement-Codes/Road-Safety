import { Text, View } from "react-native";

const DataRow = ({ title, value }) => (
    <View className="flex-row border-b border-gray-600 py-2">
      <Text className="flex-1 text-sm font-semibold text-white">{title}</Text>
      <Text className="text-sm text-white text-right">{value}</Text>
    </View>
  );

export default DataRow
