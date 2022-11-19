import React, { Component, useEffect, useRef } from "react";
import * as WebBrowser from "expo-web-browser";
import { LinearGradient } from "expo-linear-gradient";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  ScrollView,
  Image,
  Animated,
  TouchableWithoutFeedback,
} from "react-native";
import Constants from "expo-constants";
import { Camera, CameraType } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import ReactNativeZoomableView from "@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView";
import Modal from "react-native-modal";
import FirebaseProvider from "../config/Firebase/index";
import { getDoc } from "firebase/firestore";
import { withNavigation } from "react-navigation";
const document = FirebaseProvider.settings;
interface Props {
  navigation: any;
}
class TabOneScreen extends React.Component<Props> {
  camera: any;
  unsubscribe: any;
  state = {
    deviceWidth: Dimensions.get("screen").width,
    deviceHeight:
      Dimensions.get("screen").height - Constants.statusBarHeight - 94,
    hasCameraPermission: null,
    constants: Constants,
    type: CameraType.back,
    takenImage: null,
    loading: false,
    productsSuggested: [],
    tracked: false,
    objectDetected: null,
    modalVisible: false,
    widthTakenImage: 0,
    heightTakenImage: 0,
    heightRenderedImage: 0,
    modalTarget: null,
    settings: null,
    cameraFocus: true,
  };
  /**
   *
   * @param objectDetected
   */
  reTracking() {
    this.setState({
      productsSuggested: [],
      takenImage: null,
      loading: false,
      tracked: false,
      objectDetected: null,
      widthTakenImage: 0,
      heightTakenImage: 0,
      heightRenderedImage: 0,
      modalTarget: null,
    });
  }
  componentWillUnmount() {
    this.unsubscribe();
  }

  async componentDidMount() {
    const me = this;
    this.unsubscribe = this.props.navigation.addListener("focus", async () => {
      // Will be called twice when navigated from dashboard buttons
      const docSnap = await getDoc(document),
        settings = docSnap.data();
      // console.log(settings);
      me.setState({ settings: settings });
      let paramRouter = me.props.route?.params;
      if (paramRouter) {
        me.setState({ takenImage: paramRouter.uri, loading: true });
        me.onProcess(paramRouter);
      }
    });
    const { status } = await Camera.requestCameraPermissionsAsync();
    this.setState({ hasCameraPermission: status === "granted" });
  }
  /**
   * take picture and tracking image
   */
  takePicture = async () => {
    const me = this;
    if (me.camera) {
      const options = { quality: 1, base64: false };
      this.camera.takePictureAsync(options).then((res) => {
        me.setState({ takenImage: res.uri, loading: true });
        me.onProcess(res);
      });
    }
  };
  pickImage = async () => {
    const me = this;
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      this.setState({
        takenImage: result.assets[0].uri,
        loading: true,
      });
      me.onProcess(result.assets[0]);
    }
  };
  /**
   * handle load data
   * @param photo
   */
  onProcess = async (photo) => {
    const me = this;
    const saveOptions = {
      format: ImageManipulator.SaveFormat.JPEG,
      compress: 0.5,
      base64: true,
    };
    const compressed = await ImageManipulator.manipulateAsync(
      photo.uri,
      [],
      saveOptions
    );
    me.setState({
      widthTakenImage: compressed.width,
      heightTakenImage: compressed.height,
      heightRenderedImage:
        (me.state.deviceWidth * compressed.height) / compressed.width,
    });
    let fileName = compressed.uri.split("/").pop() ?? "";
    const response_api = await me.uploadImage({
      fileName: fileName,
      uri: compressed.uri,
      type: fileName.split(".").pop(),
    });
    let onlyHightestClass = me.state.settings?.onlyHightestClass;
    me.setState({
      loading: false,
      productsSuggested: response_api.productsSuggested ?? [],
      tracked: true,
      modalVisible: true,
      objectDetected: response_api.objectDetected,
      modalTarget: response_api.objectDetected?.max?.label,
    });
  };
  /**
   * get product info from api
   * @param compressed
   * @returns
   */
  uploadImage = async (response) => {
    let uri = response.uri;
    const source = {
      uri,
      name: `photo.${response.type}`,
      type: `image/${response.type}`,
    };
    let formData = new FormData();
    formData.append("file", source);
    let url =
        this.state.constants?.expoConfig?.extra?.apiUrl ??
        "http://192.168.2.103:8080",
      productTracking = {};
    // Upload the image using the fetch and FormData APIs
    let options = {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
    };
    await fetch(url, options)
      .then((response) => response.json())
      .then((result) => {
        productTracking = result;
      })
      .catch((error) => console.log("error", error));
    return productTracking;
  };

  async getProduct(data) {
    const me = this;
    if (
      me.state.modalTarget &&
      data.label &&
      me.state.modalTarget == data.label
    ) {
      me.setState({
        modalVisible: true,
      });
    } else {
      me.setState({
        modalVisible: false,
        modalTarget: null,
        loading: true,
        productsSuggested: [],
        tracked: true,
      });
      let formData = new FormData(),
        configUrl = this.state.constants?.expoConfig?.extra?.apiUrl;
      formData.append("key", data.label);
      let url = configUrl
          ? `${configUrl}/query?key=${data.label}`
          : `http://192.168.2.103:8080/query?key=${data.label}`,
        productTracking = {};
      let options = {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      };
      await fetch(url, options)
        .then((response) => response.json())
        .then((result) => {
          productTracking = result;
        })
        .catch((error) => console.log("error", error));
      me.setState({
        modalVisible: true,
        modalTarget: data.label,
        loading: false,
        productsSuggested: productTracking.productsSuggested ?? [],
        tracked: true,
      });
    }
  }
  /**
   *
   * @returns
   */
  render() {
    const me = this;
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return (
        <SafeAreaView
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text>No access to camera</Text>
        </SafeAreaView>
      );
    } else {
      return (
        <SafeAreaView style={styles.container}>
          <View style={{ borderRadius: 12, backgroundColor: "#ddd" }}>
            {(this.state.loading === true ||
              (this.state.loading === false && this.state.tracked == true)) && (
              <View style={{ width: "100%", height: "100%" }}>
                <View
                  style={{
                    flex: 1,
                  }}
                >
                  <ReactNativeZoomableView
                    zoomEnabled={!this.state.loading}
                    bindToBorders={true}
                    maxZoom={1.5}
                    minZoom={0.5}
                    zoomStep={0.25}
                    // initialZoom={0.9}
                    state={{ padding: 10, backgroundColor: "#fff" }}
                  >
                    <TouchableWithoutFeedback
                      disabled={this.state.loading}
                      onPress={() => {
                        this.reTracking();
                      }}
                      style={{ alignSelf: "center" }}
                    >
                      <View
                        style={{
                          width: this.state.deviceWidth,
                          height: "100%",
                        }}
                      >
                        <Image
                          resizeMode="contain"
                          source={{ uri: this.state.takenImage ?? "#" }}
                          style={{
                            width: this.state.deviceWidth,
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            top: 0,
                          }}
                        ></Image>
                        {me.state.loading === true && (
                          <Skeleton
                            height={me.state.heightRenderedImage}
                            width={me.state.deviceWidth}
                            style={{
                              position: "absolute",
                              top:
                                (me.state.deviceHeight -
                                  me.state.heightRenderedImage) /
                                2,
                              left: 0,
                            }}
                            backgroundColor="rgba(0,0,0,0.1)"
                            skeletonColor="rgba(236,236,236,0.1)"
                          />
                        )}
                        {this.state.objectDetected != null &&
                          me.state.widthTakenImage != null &&
                          me.state.heightTakenImage != null && (
                            <View
                              style={{
                                width: this.state.deviceWidth,
                                position: "absolute",
                                bottom: 0,
                                left: 0,
                                top: 0,
                                justifyContent: "center",
                                alignItems: "center",
                                alignSelf: "center",
                              }}
                            >
                              {(me.state.settings?.onlyHightestClass
                                ? [me.state.objectDetected.max]
                                : me.state.objectDetected.detected
                              ).map((data, i) => {
                                let box = [
                                    (data.box[0] * me.state.deviceWidth) /
                                      me.state.widthTakenImage,
                                    (data.box[1] *
                                      me.state.heightRenderedImage) /
                                      me.state.heightTakenImage,
                                  ],
                                  left = box[0],
                                  top = box[1];
                                top =
                                  top +
                                  (me.state.deviceHeight -
                                    me.state.heightRenderedImage) /
                                    2;
                                return (
                                  <TouchableOpacity
                                    // activeOpacity={0.75}
                                    key={i}
                                    onPress={() => {
                                      me.getProduct(data);
                                    }}
                                    pointerEvents={"none"}
                                    style={{
                                      width: 20,
                                      height: 20,
                                      borderRadius: 10,
                                      position: "absolute",
                                      left: left,
                                      top: top,
                                      justifyContent: "center",
                                      alignItems: "center",
                                    }}
                                  >
                                    <View
                                      key={i}
                                      style={{
                                        width: 16,
                                        height: 16,
                                        borderRadius: 8,
                                        borderWidth: 2,
                                        borderColor:
                                          me.state.modalTarget == data.label
                                            ? "#27c4f5"
                                            : "#fff",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        backgroundColor: "#d1d1d1",
                                      }}
                                    ></View>
                                  </TouchableOpacity>
                                );
                              })}
                            </View>
                          )}
                      </View>
                    </TouchableWithoutFeedback>
                  </ReactNativeZoomableView>
                </View>
                {/* wrap modal */}
                <Modal
                  animationType={"slide"}
                  transparent={true}
                  visible={
                    this.state.modalVisible ||
                    (this.state.loading &&
                      !this.state.modalVisible &&
                      this.state.tracked)
                  }
                >
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({ modalVisible: false });
                    }}
                    style={{
                      left: -15,
                      width: this.state.deviceWidth,
                      position: "absolute",
                      height: "100%",
                      // backgroundColor: "#111",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        height: 210,
                        width: "100%",
                        position: "absolute",
                        bottom: 50,
                        left: 0,
                        alignSelf: "center",
                      }}
                    >
                      {/* loading */}
                      {this.state.loading === true && (
                        <ScrollView
                          scrollEnabled={!this.state.loading}
                          horizontal={true}
                          style={{ paddingBottom: 12 }}
                        >
                          <View
                            style={{
                              padding: 4,
                              width: 150,
                              backgroundColor: "#fff",
                              marginRight: 8,
                              borderRadius: 4,
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <Skeleton
                              height={130}
                              width={140}
                              style={{ borderRadius: 10 }}
                            />
                            <Skeleton
                              height={20}
                              width={140}
                              style={{ borderRadius: 10, marginTop: 4 }}
                            />
                            <Skeleton
                              height={20}
                              width={140}
                              style={{ borderRadius: 10, marginTop: 4 }}
                            />
                          </View>
                          <View
                            style={{
                              padding: 4,
                              width: 150,
                              backgroundColor: "#fff",
                              marginRight: 8,
                              borderRadius: 4,
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <Skeleton
                              height={130}
                              width={140}
                              style={{ borderRadius: 10 }}
                            />
                            <Skeleton
                              height={20}
                              width={140}
                              style={{ borderRadius: 10, marginTop: 4 }}
                            />
                            <Skeleton
                              height={20}
                              width={140}
                              style={{ borderRadius: 10, marginTop: 4 }}
                            />
                          </View>
                          <View
                            style={{
                              padding: 4,
                              width: 150,
                              backgroundColor: "#fff",
                              marginRight: 8,
                              borderRadius: 4,
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <Skeleton
                              height={80}
                              width={140}
                              style={{ borderRadius: 10 }}
                            />
                            <Skeleton
                              height={20}
                              width={140}
                              style={{ borderRadius: 10, marginTop: 4 }}
                            />
                            <Skeleton
                              height={20}
                              width={140}
                              style={{ borderRadius: 10, marginTop: 4 }}
                            />
                          </View>
                        </ScrollView>
                      )}
                      {/* products suggested list */}
                      {this.state.loading === false &&
                        this.state.productsSuggested.length > 0 && (
                          <ScrollView
                            scrollEnabled={!this.state.loading}
                            horizontal={true}
                            style={{ paddingBottom: 12 }}
                          >
                            {this.state.productsSuggested.map((data, i) => (
                              <TouchableOpacity
                                activeOpacity={0.75}
                                key={i + "TouchableOpacity"}
                                onPress={() => {
                                  WebBrowser.openBrowserAsync(data.link);
                                }}
                                style={{ alignSelf: "center" }}
                              >
                                <View
                                  key={i + "wrapView"}
                                  style={{
                                    padding: 4,
                                    width: 150,
                                    height: 162,
                                    backgroundColor: "#fff",
                                    marginRight: 8,
                                    borderRadius: 4,
                                    justifyContent: "center",
                                  }}
                                >
                                  <Image
                                    key={i + "Image"}
                                    source={{ uri: data.source }}
                                    style={{
                                      width: 80,
                                      height: 80,
                                      resizeMode: "contain",
                                      marginLeft: 35,
                                    }}
                                  />
                                  <Text
                                    key={i + "title"}
                                    numberOfLines={2}
                                    style={{
                                      marginTop: 4,
                                      padding: 4,
                                      fontSize: 12,
                                      fontWeight: "bold",
                                    }}
                                  >
                                    {data.title}
                                  </Text>
                                  <Text
                                    key={i + "price-text"}
                                    numberOfLines={1}
                                    style={{
                                      paddingLeft: 4,
                                      padding: 2,
                                      fontSize: 11,
                                      fontWeight: "bold",
                                    }}
                                  >
                                    {data["price-text"]}{" "}
                                    <Text
                                      key={i + "shipping"}
                                      style={{
                                        paddingLeft: 2,
                                        padding: 2,
                                        fontSize: 8,
                                        fontWeight: "normal",
                                      }}
                                    >
                                      {data["shipping"]}
                                    </Text>
                                  </Text>
                                  <Text
                                    key={i + "origin"}
                                    numberOfLines={1}
                                    style={{
                                      paddingLeft: 4,
                                      padding: 2,
                                      fontSize: 10,
                                    }}
                                  >
                                    {data["origin"]}
                                  </Text>
                                </View>
                              </TouchableOpacity>
                            ))}
                          </ScrollView>
                        )}
                      {this.state.loading === false &&
                        this.state.productsSuggested.length == 0 && (
                          <View
                            style={{
                              height: "100%",
                              width: "100%",
                              backgroundColor: "#fff",
                              alignSelf: "center",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Image
                              resizeMode="contain"
                              source={require("../assets/images/notfound.png")}
                              style={{
                                width: "100%",
                                height: "70%",
                                // backgroundColor: "#111",
                              }}
                            ></Image>
                            <Text>No products found</Text>
                          </View>
                        )}
                    </View>
                  </TouchableOpacity>
                </Modal>
              </View>
            )}
            {this.state.loading === false &&
              this.state.tracked == false &&
              this.state.productsSuggested.length === 0 && (
                <View
                  style={{
                    display: "flex",
                    height: Dimensions.get("window").height,
                    justifyContent: "space-around",
                    alignItems: "center",
                    flexDirection: "column",
                  }}
                >
                  <Camera
                    autoFocus={this.state.cameraFocus}
                    ref={(ref) => {
                      this.camera = ref;
                    }}
                    style={{ height: "100%", width: "100%" }}
                    type={this.state.type}
                  ></Camera>
                  <View
                    style={{
                      width: 70,
                      height: 70,
                      justifyContent: "center",
                      alignItems: "center",
                      position: "absolute",
                      bottom: 150,
                    }}
                  >
                    <TouchableOpacity
                      onPress={this.takePicture}
                      style={{ alignSelf: "center" }}
                    >
                      <Ionicons
                        name="ios-radio-button-on"
                        size={70}
                        color="#fff"
                      />
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      width: 70,
                      height: 70,
                      justifyContent: "center",
                      alignItems: "center",
                      position: "absolute",
                      bottom: 150,
                      left: 30,
                    }}
                  >
                    <TouchableOpacity
                      style={{ alignSelf: "center" }}
                      onLongPress={() => {
                        this.setState({ cameraFocus: !this.state.cameraFocus });
                      }}
                      onPress={() => {
                        this.pickImage();
                      }}
                    >
                      <Ionicons
                        name="ios-images-outline"
                        size={25}
                        color="#fff"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
          </View>
        </SafeAreaView>
      );
    }
  }
}

const Skeleton = ({
  width = 0,
  height = 0,
  style = {},
  backgroundColor = "rgba(0,0,0,0.12)",
  skeletonColor = "rgba(0,0,0,0.05)",
}) => {
  const translateX = useRef(new Animated.Value(-width)).current;
  useEffect(() => {
    Animated.loop(
      Animated.timing(translateX, {
        toValue: width,
        useNativeDriver: true,
        duration: 1000,
      })
    ).start();
  }, [width]);
  return (
    <View
      style={StyleSheet.flatten([
        {
          width: width,
          height: height,
          backgroundColor: backgroundColor,
          overflow: "hidden",
        },
        style,
      ])}
    >
      <Animated.View
        style={{
          width: "100%",
          height: "100%",
          transform: [{ translateX: translateX }],
        }}
      >
        <LinearGradient
          style={{
            width: "100%",
            height: "100%",
          }}
          colors={["transparent", skeletonColor, "transparent"]}
          start={{ x: 1, y: 1 }}
        ></LinearGradient>
      </Animated.View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginTop: Constants.statusBarHeight,
    backgroundColor: "#fff",
  },
});
export default withNavigation(TabOneScreen);
