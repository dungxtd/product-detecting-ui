import Constants from "expo-constants";
import React from "react";
import { StyleSheet, View, Switch, Text } from "react-native";
import { getDoc, updateDoc } from "firebase/firestore";
import FirebaseProvider from "../config/Firebase/index";
const document = FirebaseProvider.document;
export default class Setting extends React.Component {
  state = {
    onlyHightestClass: null,
    fireBaseConfig: Constants.expoConfig?.extra?.fireBaseConfig,
  };
  async componentDidMount() {
    const me = this;
    const docSnap = await getDoc(document),
      settings = docSnap.data();
    me.setState(settings);
  }

  onChangeShowingOnlyHightestClass = async (value: boolean) => {
    const me = this;
    await updateDoc(document, { onlyHightestClass: value })
      .then(() => {})
      .catch((err) => console.log(err));
    me.setState({
      onlyHightestClass: value,
    });
  };
  render() {
    return (
      <View style={styles.container}>
        {this.state.onlyHightestClass !== null && (
          <View style={styles.buttonContainer}>
            <Text style={{}}>Show only highest class</Text>
            <Switch
              // style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
              value={this.state.onlyHightestClass}
              onValueChange={this.onChangeShowingOnlyHightestClass.bind(this)}
            />
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    // marginVertical: 30,
    // height: 1,
    width: "100%",
  },
  buttonContainer: {
    backgroundColor: "transparent",
    padding: "5%",
    width: "90%",
    borderBottomWidth: 1,
    borderBottomColor: "#dedede",
    marginStart: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
