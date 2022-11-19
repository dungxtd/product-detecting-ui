import Constants from "expo-constants";
import React from "react";
import { StyleSheet, View, Switch, Text } from "react-native";
import { getDoc, updateDoc } from "firebase/firestore";
import FirebaseProvider from "../config/Firebase/index";
import { withNavigation } from "react-navigation";
const settingDocument = FirebaseProvider.settings;
interface Props {
  navigation: any;
}

class Setting extends React.Component<Props> {
  state = {
    onlyHightestClass: null,
    fireBaseConfig: Constants.expoConfig?.extra?.fireBaseConfig,
  };
  unsubscribe: any;
  componentWillUnmount() {
    this.unsubscribe();
  }
  async componentDidMount() {
    const me = this;
    this.unsubscribe = this.props.navigation.addListener("focus", async () => {
      // Will be called twice when navigated from dashboard buttons
      // console.log(this.props.navigation.);
      // this.props.navigation.navigate("TabTwoScreen");
      const docSnap = await getDoc(settingDocument),
        settings = docSnap.data();
      me.setState(settings);
    });
  }

  onChangeShowingOnlyHightestClass = async (value: boolean) => {
    const me = this;
    if (me.state.onlyHightestClass === value) {
      return;
    }
    me.setState({
      onlyHightestClass: value,
    });
    await updateDoc(settingDocument, { onlyHightestClass: value })
      .then(() => {})
      .catch((err) => console.log(err));
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
export default withNavigation(Setting);
