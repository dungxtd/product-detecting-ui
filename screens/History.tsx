import Constants from "expo-constants";
import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import FirebaseProvider from "../config/Firebase/index";
import { withNavigation } from "react-navigation";
import { getDoc, getDocs } from "firebase/firestore";
import { SafeAreaView } from "react-native-safe-area-context";
const historyCollection = FirebaseProvider.history;
interface Props {
  navigation: any;
}
class History extends React.Component<Props> {
  state = {
    history: [],
  };
  unsubscribe: any;
  componentWillUnmount() {
    this.unsubscribe();
  }
  async componentDidMount() {
    const me = this;
    this.unsubscribe = this.props.navigation.addListener("focus", async () => {
      let docs = [];
      const querySnapshot = await getDocs(historyCollection);
      querySnapshot.forEach((doc) => {
        docs.push(doc.data());
      });
      docs.sort((a, b) => {
        if (a.time?.seconds < b.time?.seconds) {
          return 1;
        }
        if (a.time?.seconds > b.time?.seconds) {
          return -1;
        }
        return 0;
      });
      this.setState({ history: docs });
    });
  }
  convertDatetime(timeStep) {
    var timestemp = new Date(timeStep.seconds * 1000);
    return (
      ("0" + timestemp.getHours()).slice(-2) +
      ":" +
      ("0" + timestemp.getMinutes()).slice(-2) +
      " " +
      ("0" + timestemp.getDate()).slice(-2) +
      "/" +
      ("0" + timestemp.getMonth()).slice(-2) +
      "/" +
      timestemp.getFullYear()
    );
  }
  render(): React.ReactNode {
    const me = this;
    return (
      <ScrollView style={styles.container}>
        {this.state.history &&
          this.state.history.map((data, index) => {
            return (
              <View style={styles.separator} key={index}>
                <TouchableOpacity
                  style={{
                    width: "100%",
                    height: 100,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                  onPress={() => {
                    me.props.navigation.navigate("TabOne", data);
                  }}
                  key={index + " wrap"}
                >
                  <Image
                    key={index + "image"}
                    resizeMode="contain"
                    source={{ uri: data.uri }}
                    style={{
                      width: 100,
                      height: 100,
                      resizeMode: "contain",
                      padding: 10,
                      margin: 0,
                    }}
                  ></Image>
                  <View
                    key={index}
                    style={{
                      padding: 20,
                    }}
                  >
                    <Text
                      key={index + " word"}
                      style={{
                        fontWeight: "bold",
                        lineHeight: 25,
                      }}
                    >
                      {data.text?.Word ?? "(unknown class)"}
                    </Text>
                    <Text key={index + " time"} style={{ lineHeight: 20 }}>
                      {this.convertDatetime(data.time)}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            );
          })}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
  },
  separator: {
    width: "100%",
    height: 100,
  },
});
export default withNavigation(History);
