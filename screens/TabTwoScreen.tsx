import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const TabTwoScreen = ({ route, navigation }) => {
  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", backgroundColor: "#fff" }}
    >
      <View style={{ flex: 1 }}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Settings")}
        >
          <Text>Settings</Text>
          <Ionicons name="ios-arrow-forward" size={20} color="#333333" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("History")}
        >
          <Text>History</Text>
          <Ionicons name="ios-arrow-forward" size={20} color="#333333" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  button: {
    backgroundColor: "transparent",
    padding: "5%",
    width: "90%",
    borderBottomWidth: 1,
    borderBottomColor: "#dedede",
    marginStart: "5%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
export default TabTwoScreen;
