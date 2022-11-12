import React, { useEffect, useRef } from "react";
import * as WebBrowser from "expo-web-browser";
import { LinearGradient } from "expo-linear-gradient";
import {
  Text,
  View,
  Alert,
  TouchableNativeFeedback,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Image,
  Animated,
} from "react-native";
import Constants from "expo-constants";
import { Camera, CameraType } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";
import { Ionicons } from "@expo/vector-icons";
import { decode as atob, encode as btoa } from "base-64";
import axios from "axios";
export default class TabOneScreen extends React.Component {
  camera: any;
  state = {
    hasCameraPermission: null,
    constants: Constants,
    type: CameraType.back,
    takenImage: null,
    // loading: true,
    // response: [
    //   {
    //     link: "https://www.google.com/url?q=https://yenfarmvn.com/products/banh-gao-ichi-lon-100gr&sa=U&ved=0ahUKEwiRlqOiyKj7AhUHCIgKHfCAC3AQ2SkILA&usg=AOvVaw270XRgFoMBJM7FFdS9G_lr",
    //     origin: "từ Công ty TNHH Thực Phẩm Yen Farm",
    //     price: 22,
    //     "price-text": "22 ₫",
    //     shipping: "",
    //     source:
    //       "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQxhFp_TgKuwaluu4eRQNobMdpupRhmDQVWcqt2oNcCdzE7puyZICrUH0Y9WASaDPJJ7s8o&usqp=CAE",
    //     title: "Bánh gạo Ichi Lon 100gr",
    //   },
    // ],
    loading: false,
    response: [],
  };

  async componentDidMount() {
    const { status } = await Camera.requestCameraPermissionsAsync();
    this.setState({ hasCameraPermission: status === "granted" });
  }

  takePicture = async () => {
    const me = this;
    if (me.camera) {
      this.camera.takePictureAsync().then((res) => {
        me.setState({ takenImage: res.uri });
        me.setState({ loading: true });
        me.onProcess(res.uri);
      });
    }
  };

  onProcess = async (photo) => {
    const me = this;
    const compressed = await ImageManipulator.manipulateAsync(
      photo,
      [{ resize: { width: 200 } }],
      { base64: true }
    );
    // let imageBytes = this.getBinary(compressed.base64);
    // let params = {
    //   Image: {
    //     Bytes: imageBytes
    //   }
    // };
    const response_api = await me.getProductFromApi(compressed);
    setTimeout(() => {
      me.setState({
        loading: false,
        response: response_api,
      });
    }, 1000);
  };

  getProductFromApi = async (compressed) => {
    let url = this.state.constants?.expoConfig?.extra?.apiUrl;
    // Upload the image using the fetch and FormData APIs
    // let formData = new FormData();
    // formData.append('file', compressed.base64);
    // axios({
    //   method: "post",
    //   url: "http://localhost:2808/",
    //   data: formData,
    //   headers: { "Content-Type": "multipart/form-data" },
    // })
    //   .then(function (response) {
    //     //handle success
    //     debugger
    //   })
    //   .catch(function (response) {
    //     //handle error
    //     debugger
    //   });
    return [
      {
        link: "https://www.google.com/url?q=https://yenfarmvn.com/products/banh-gao-ichi-lon-100gr&sa=U&ved=0ahUKEwiRlqOiyKj7AhUHCIgKHfCAC3AQ2SkILA&usg=AOvVaw270XRgFoMBJM7FFdS9G_lr",
        origin: "từ Công ty TNHH Thực Phẩm Yen Farm",
        price: 22,
        "price-text": "22 ₫",
        shipping: "",
        source:
          "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQxhFp_TgKuwaluu4eRQNobMdpupRhmDQVWcqt2oNcCdzE7puyZICrUH0Y9WASaDPJJ7s8o&usqp=CAE",
        title: "Bánh gạo Ichi Lon 100gr",
      },
      {
        link: "https://www.google.com/url?q=https://www.lazada.vn/products/banh-gao-shouyu-mat-ong-ichi-100g-i1596610196-s6844362065.html&sa=U&ved=0ahUKEwiRlqOiyKj7AhUHCIgKHfCAC3AQ2SkILw&usg=AOvVaw04zreyoU6hBE1LnFuBi_Fc",
        origin: "từ Lazada Vietnam",
        price: 25625,
        "price-text": "25.625 ₫",
        shipping: "Vận chuyển miễn phí",
        source:
          "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcSZZ3RvSiKa5qU7_6hMoL6yiwcLnpAQ06DsuugQPmcE5vQ8PpPe_aFW1-w1Y7kxEiXN5_p4YA&usqp=CAE",
        title: "Bánh Gạo Shouyu Mật Ong Ichi 100G",
      },
      {
        link: "https://www.google.com/url?q=https://shopee.vn/B%25C3%25A1nh-G%25E1%25BA%25A1o-Nh%25E1%25BA%25ADt-Ichi-V%25E1%25BB%258B-Shouyu-M%25E1%25BA%25ADt-Ong-i.177223077.2786772662&sa=U&ved=0ahUKEwiRlqOiyKj7AhUHCIgKHfCAC3AQ2SkIMg&usg=AOvVaw2GK5lvdNoJJ9YmXg586KSY",
        origin: "từ Shopee",
        price: 18000,
        "price-text": "18.000 ₫",
        shipping: "",
        source:
          "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQGIPhPmazAl6769eXtBwWONpmg8q-IZTDur3kFcpoDmzH7wXfkEowBI3bnm0FZUmGVV-eP-w&usqp=CAE",
        title: "Bánh Gạo Nhật Ichi Vị Shouyu Mật Ong ICHI",
      },
      {
        link: "https://www.google.com/url?q=https://www.lazada.vn/products/banh-gao-nhat-ichi-vi-shouyu-mat-ong-i2024316406-s9431503435.html&sa=U&ved=0ahUKEwiRlqOiyKj7AhUHCIgKHfCAC3AQ2SkINQ&usg=AOvVaw20RjV7Xz5eFN8zyek8oT2D",
        origin: "từ Lazada Vietnam",
        price: 40000,
        "price-text": "40.000 ₫",
        shipping: "Vận chuyển miễn phí",
        source:
          "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQY8dYHw4TKGecmXv5hkYQRBMF0HfOeuae1H3bBg5WqdpL6LPyJkVROKkE-dG32ISVZoH3-&usqp=CAE",
        title: "Bánh Gạo Nhật Ichi Vị Shouyu Mật Ong",
      },
      {
        link: "https://www.google.com/url?q=https://shopee.vn/B%25C3%25A1nh-g%25E1%25BA%25A1o-Ichi-Nh%25E1%25BA%25ADt-v%25E1%25BB%258B-shouyu-m%25E1%25BA%25ADt-ong-180g-i.24026365.1605745865&sa=U&ved=0ahUKEwiRlqOiyKj7AhUHCIgKHfCAC3AQ2SkIOA&usg=AOvVaw3Alqi6QFqXwgcA_QB6hzXy",
        origin: "từ Shopee",
        price: 29500,
        "price-text": "29.500 ₫",
        shipping: "",
        source:
          "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcQfylw7U-la7YOx01c6IUTa5IQYEK84Xwv1WFgwH2zDWjd3Z7l9erTWupnz8U21dqykwESA&usqp=CAE",
        title: "Bánh gạo Ichi Nhật vị shouyu mật ong 180g NoBrand",
      },
      {
        link: "https://www.google.com/url?q=https://www.lazada.vn/products/banh-gao-ichi-i1572613991-s6671061246.html&sa=U&ved=0ahUKEwiRlqOiyKj7AhUHCIgKHfCAC3AQ2SkIOw&usg=AOvVaw3G56Ceswcf5DoOSKzqJPVj",
        origin: "từ Lazada Vietnam",
        price: 25000,
        "price-text": "25.000 ₫",
        shipping: "Vận chuyển miễn phí",
        source:
          "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcS7m55NENdEFbgom2Oxa8lb9J776PUfGtzc_z_iC_nYYECBN4fAaiILi680&usqp=CAE",
        title: "Bánh Gạo Ichi",
      },
      {
        link: "https://www.google.com/url?q=https://shopee.vn/B%25C3%25A1nh-g%25E1%25BA%25A1o-Nh%25E1%25BA%25ADt-Ichi-v%25E1%25BB%258B-Shouyu-M%25E1%25BA%25ADt-Ong-180g-i.87656801.17182382071&sa=U&ved=0ahUKEwiRlqOiyKj7AhUHCIgKHfCAC3AQ2SkIPg&usg=AOvVaw1a5_YcJlRABUjXHxEErXuk",
        origin: "từ Shopee",
        price: 47500,
        "price-text": "47.500 ₫",
        shipping: "",
        source:
          "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQ2smtWFxw-Pyx5YAhwM79dTVySh0Tc70PdEoyPVVNxUUbTIjJz_AG9MNmIAaLzNs3w3QJ5&usqp=CAE",
        title: "Bánh gạo Nhật Ichi vị Shouyu Mật Ong 180g NoBrand",
      },
      {
        link: "https://www.google.com/url?q=https://www.lazada.vn/products/banh-gao-nhat-ichi-loi-1kg-i969262877-s3013946087.html&sa=U&ved=0ahUKEwiRlqOiyKj7AhUHCIgKHfCAC3AQ2SkIQQ&usg=AOvVaw10WIwEsGcmgRFOneJFRh3f",
        origin: "từ Lazada Vietnam",
        price: 85000,
        "price-text": "85.000 ₫",
        shipping: "Vận chuyển miễn phí",
        source:
          "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcS0eFf4iV73vj35quD6qpjvjgp_KJazJmZZUA0rD9ulzc6vvrIZDGitJgM&usqp=CAE",
        title: "Bánh gạo Nhật IChi lỗi 1kg",
      },
      {
        link: "https://www.google.com/url?q=https://shopee.vn/B%25C3%25A1nh-g%25E1%25BA%25A1o-m%25E1%25BA%25ADt-ong-ichi-100gr-i.57280229.16519751563&sa=U&ved=0ahUKEwiRlqOiyKj7AhUHCIgKHfCAC3AQ2SkIRA&usg=AOvVaw3K2U2yoCs-fodXuHx3jE92",
        origin: "từ Shopee",
        price: 17000,
        "price-text": "17.000 ₫",
        shipping: "",
        source:
          "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSDS8U1WMd8-kQC5HUUTbcJiG6ImldI8Y4YtqJjMjnAIWuKEOIfmeyVWTjZ&usqp=CAE",
        title: "Bánh gạo mật ong ichi 100gr NoBrand",
      },
      {
        link: "https://www.google.com/url?q=https://aeoneshop.com/products/banh-gao-nhat-ichi-vi-mat-ong-kameda-goi-100g%3Fview%3Dhn&sa=U&ved=0ahUKEwiRlqOiyKj7AhUHCIgKHfCAC3AQ2SkIRw&usg=AOvVaw2DQloH0xbQ5QpL-ROx72WA",
        origin: "từ AeonEshop",
        price: 22400,
        "price-text": "22.400 ₫",
        shipping: "+ 15.000 ₫ phí giao hàng",
        source:
          "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSM5Q6jR_SFwx10BeOSH9-mh4CtaYGqzHMppWwWNxG7eAkNoKlgfufQ4YI9edlRLmH8y9nz&usqp=CAE",
        title: "Bánh Gạo Nhật Ichi Vị Mật Ong Kameda Gói 100g",
      },
      {
        link: "https://www.google.com/url?q=https://nhanvan.vn/products/banh-gao-nhat-ichi-100g%3Futm_content%3Dbanh-gao-nhat-ichi-100g%26utm_source%3Dgoogleads%26utm_medium%3Dcpc%26utm_campaign%3Dproductfeeds%26utm_term%3Dnhanvan%26srsltid%3DAYJSbAfnhi99Zq7F5RWaqACg9EqFa6iTXPCn7ZXcOWZ37oWOwVoz6fxREJM&sa=U&ved=0ahUKEwiRlqOiyKj7AhUHCIgKHfCAC3AQ2SkISg&usg=AOvVaw0DdeNv6Cd3kU-8eCxZNtK3",
        origin: "từ nhanvan.vn",
        price: 19500,
        "price-text": "19.500 ₫",
        shipping: "+ 3.900 ₫ phí giao hàng",
        source:
          "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcTKsFMmBVkcdgApkjHizjFnYO6rTqou6olw-zT5mXDugPYarn9SRxSked3bxN9i6eabFZ8KBA&usqp=CAE",
        title: "Bánh Gạo Nhật Ichi (100g)",
      },
      {
        link: "https://www.google.com/url?q=https://www.lazada.vn/products/banh-gao-nhat-ichi-goi-180g-i1547787053-s6515652668.html&sa=U&ved=0ahUKEwiRlqOiyKj7AhUHCIgKHfCAC3AQ2SkITQ&usg=AOvVaw0QlnDvQ-4s59v9BO5cNefB",
        origin: "từ Lazada Vietnam",
        price: 25000,
        "price-text": "25.000 ₫",
        shipping: "Vận chuyển miễn phí",
        source:
          "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSLpX__ssISWsdnTdKZPeY4hdDgf2GXpqGlJClOMG7S0cP3xGxHjnFGWSY9KzTb7iCOsu6n&usqp=CAE",
        title: "Bánh gạo Nhật Ichi gói 180g",
      },
      {
        link: "https://www.google.com/url?q=https://shopee.vn/B%25C3%25A1nh-g%25E1%25BA%25A1o-m%25E1%25BA%25ADt-ong-ICHI---date-m%25E1%25BB%259Bi-i.313929691.17127200471&sa=U&ved=0ahUKEwiRlqOiyKj7AhUHCIgKHfCAC3AQ2SkIUA&usg=AOvVaw15flJ4lzoeRzro0WxwJNoP",
        origin: "từ Shopee",
        price: 18000,
        "price-text": "18.000 ₫",
        shipping: "",
        source:
          "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcT4pTb9Tllk5lCNhhRwV1_X-5VQKW6UDAM_yz--Dllp7NSzWlSy5fmWOd9AB_-pPLufudL3RQ&usqp=CAE",
        title: "Bánh gạo mật ong ICHI - date mới NoBrand",
      },
      {
        link: "https://www.google.com/url?q=https://www.sendo.vn/banh-gao-ichi-richy-vi-mat-ong-100g-21781479.html%3Futm_content%3Dthucpham-banhmut-banhgaonui-gg&sa=U&ved=0ahUKEwiRlqOiyKj7AhUHCIgKHfCAC3AQ2SkIUw&usg=AOvVaw2uggcPjYY9HcprNAMOHT31",
        origin: "từ Sendo.vn",
        price: 16000,
        "price-text": "16.000 ₫",
        shipping: "Vận chuyển miễn phí",
        source:
          "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQk3KWNe9NWzOimyQfH6JAVwxUawOjdKh43muW_l972Mx-0duR6OhCVqdc&usqp=CAE",
        title:
          "Bánh Gạo Ichi Richy Vị Mật Ong 100g- Đủ Loại/Màu - Chất Lượng Cao - Còn Hàng",
      },
      {
        link: "https://www.google.com/url?q=https://sanestsvmart.com.vn/products/banh-gao-ichi-mat-ong-goi-100g&sa=U&ved=0ahUKEwiRlqOiyKj7AhUHCIgKHfCAC3AQ2SkIVg&usg=AOvVaw0lvYOFKgkr93zkh_CLdC3A",
        origin: "từ Yến Sào Khánh Hòa",
        price: 18000,
        "price-text": "18.000 ₫",
        shipping: "Vận chuyển miễn phí",
        source:
          "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQ0NSLvD_Vq1GzyWdbJ5RIckj92HYQmDi1z4i5Pnxp16OW2VraGaEL7xCkPcU42UREIx3F6Bw&usqp=CAE",
        title: "Bánh gạo Ichi mật ong gói 100g",
      },
      {
        link: "https://www.google.com/url?q=https://nhanvan.vn/products/banh-gao-nhat-ichi-100g%3Fvariant%3D1056901142%26source%3Dgoogleshop%26utm_campaign%3Dsmart_shopping%26utm_medium%3Dcpc%26utm_source%3Dgoogle%26srsltid%3DAYJSbAdKhtIGINinETi0fDzH7cq0WRApYnvWK6IGVftrp7DUozwznP1n-5c&sa=U&ved=0ahUKEwiRlqOiyKj7AhUHCIgKHfCAC3AQ2SkIWQ&usg=AOvVaw1OCWR_1KWUFVFZYrFU3bu_",
        origin: "từ nhanvan.vn",
        price: 19500,
        "price-text": "19.500 ₫",
        shipping: "+ 3.900 ₫ phí giao hàng",
        source:
          "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcRKOKA3k6-e3I58UUWnPr3m6rlCK9Zl7ZFJuQatj59PgFDRsHxqbPIoetE09JH9zRU0kc9poQ&usqp=CAE",
        title: "[GIÁ TỐT] - Bánh Gạo Nhật Ichi (100g)",
      },
      {
        link: "https://www.google.com/url?q=https://www.lazada.vn/products/banh-gao-nhat-ichi-i2017170899-s9391721495.html&sa=U&ved=0ahUKEwiRlqOiyKj7AhUHCIgKHfCAC3AQ2SkIXA&usg=AOvVaw1vN0DXEfQ1XvvNZuAd8Vwr",
        origin: "từ Lazada Vietnam",
        price: 18000,
        "price-text": "18.000 ₫",
        shipping: "Vận chuyển miễn phí",
        source:
          "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcTDYMElLcjJleLYQVtZCUOWpAavVs1w_mUGjM3gol5p4kzrDeuikxE0MRzQ&usqp=CAE",
        title: "Bánh Gạo Nhật Ichi",
      },
      {
        link: "https://www.google.com/url?q=https://shopee.vn/B%25C3%2581NH-G%25E1%25BA%25A0O-ICHI-180G-i.57535870.1257712785&sa=U&ved=0ahUKEwiRlqOiyKj7AhUHCIgKHfCAC3AQ2SkIXw&usg=AOvVaw0X5n0NPpCeMyg-cUMsJs7t",
        origin: "từ Shopee",
        price: 29000,
        "price-text": "29.000 ₫",
        shipping: "",
        source:
          "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcTN7HMSc8UETnHPMxM1toXwKZ3RhKZFb7WOwAd8xlurD4nkX4v45zb4vlM&usqp=CAE",
        title: "BÁNH GẠO ICHI 180G NoBrand",
      },
      {
        link: "https://www.google.com/url?q=https://www.sendo.vn/1-goi-banh-gao-nhat-ichi-9436760.html%3Futm_content%3Dthucpham-banhmut-banhgaonui-gg&sa=U&ved=0ahUKEwiRlqOiyKj7AhUHCIgKHfCAC3AQ2SkIYg&usg=AOvVaw3eLIgSLFTqJb8gVU4iU83B",
        origin: "từ Sendo.vn",
        price: 30000,
        "price-text": "30.000 ₫",
        shipping: "Vận chuyển miễn phí",
        source:
          "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcT5SzCp_r6rjSP_j-lgu6YMiwTj7QY14zpPCtd4uLgdi9et7iLMKYEP8XN3ffvmlWWfM77P&usqp=CAE",
        title:
          "1 Gói Bánh Gạo Nhật Ichi- Đủ Loại/Màu - Chất Lượng Cao - Còn Hàng",
      },
      {
        link: "https://www.google.com/url?q=https://www.lazada.vn/products/banh-gao-nhat-ichi-vi-shouyu-mat-ong-goi-100g-i1351292071-s5567927169.html&sa=U&ved=0ahUKEwiRlqOiyKj7AhUHCIgKHfCAC3AQ2SkIZQ&usg=AOvVaw0YJO60uvQDCymeHi0GrjGJ",
        origin: "từ Lazada Vietnam",
        price: 17000,
        "price-text": "17.000 ₫",
        shipping: "Vận chuyển miễn phí",
        source:
          "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcS0Y4UakYan4xKapqzqqnz0K-MZBfTfen9Qh2Qe98FqUnGCEKSed_7ogiici---xDxYQMpI3A&usqp=CAE",
        title: "Bánh Gạo Nhật Ichi Vị Shouyu Mật Ong (Gói 100g)",
      },
    ];
  };

  getBinary(base64Image) {
    let binaryImg = atob(base64Image);
    let length = binaryImg.length;
    let ab = new ArrayBuffer(length);
    let ua = new Uint8Array(ab);
    for (let i = 0; i < length; i++) {
      ua[i] = binaryImg.charCodeAt(i);
    }
    return ab;
  }

  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <SafeAreaView style={styles.container}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
            style={{ borderRadius: 12, backgroundColor: "#ddd" }}
          >
            {(this.state.loading === true ||
              (this.state.loading === false &&
                this.state.response.length > 0)) && (
              <View style={{ width: "100%", height: "100%" }}>
                <View
                  style={{
                    backgroundColor: "#111",
                    height: Dimensions.get("window").height,
                    justifyContent: "center",
                    flexDirection: "column",
                  }}
                >
                  <TouchableNativeFeedback
                    onPress={() => {
                      this.setState({ response: [] });
                    }}
                    style={{ alignSelf: "center" }}
                  >
                    <Image
                      source={{ uri: this.state.takenImage ?? "#" }}
                      style={{ width: "100%", height: "100%" }}
                    />
                  </TouchableNativeFeedback>
                  <ScrollView
                    horizontal={true}
                    style={{
                      height: 210,
                      width: "100%",
                      position: "absolute",
                      top: Dimensions.get("window").height - 340,
                      left: 0,
                      alignSelf: "center",
                      paddingBottom: 12,
                    }}
                  ></ScrollView>
                </View>
                <View
                  style={{
                    height: 210,
                    width: "100%",
                    position: "absolute",
                    top: Dimensions.get("window").height - 340,
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
                    </ScrollView>
                  )}
                  {this.state.loading === false &&
                    this.state.response.length > 0 && (
                      <ScrollView
                        scrollEnabled={!this.state.loading}
                        horizontal={true}
                        style={{ paddingBottom: 12 }}
                      >
                        {this.state.response.map((data, i) => (
                          <TouchableOpacity
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
                                backgroundColor: "#fff",
                                marginRight: 8,
                                borderRadius: 4,
                                justifyContent: "center",
                              }}
                            >
                              <Image
                                key={i + "Image"}
                                source={{ uri: data.source }}
                                style={{ width: "100%", height: 130 }}
                              />
                              <Text
                                key={i + "title"}
                                numberOfLines={1}
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

                              {/* {
          "link": "https://www.google.com/url?q=https://www.lazada.vn/products/banh-gao-shouyu-mat-ong-ichi-100g-i1596610196-s6844362065.html&sa=U&ved=0ahUKEwiRlqOiyKj7AhUHCIgKHfCAC3AQ2SkILw&usg=AOvVaw04zreyoU6hBE1LnFuBi_Fc",
          "origin": "từ Lazada Vietnam",
          "price": 25625,
          "price-text": "25.625 ₫",
          "shipping": "Vận chuyển miễn phí",
          "source": "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcSZZ3RvSiKa5qU7_6hMoL6yiwcLnpAQ06DsuugQPmcE5vQ8PpPe_aFW1-w1Y7kxEiXN5_p4YA&usqp=CAE",
          "title": "Bánh Gạo Shouyu Mật Ong Ichi 100G"
      } */}
                            </View>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    )}
                </View>
              </View>
            )}
            {this.state.loading === false && this.state.response.length === 0 && (
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
                  autoFocus={true}
                  ref={(ref) => {
                    this.camera = ref;
                  }}
                  style={{ height: "100%", width: "100%" }}
                  type={this.state.type}
                ></Camera>
                <View
                  style={{
                    width: "100%",
                    height: 70,
                    justifyContent: "center",
                    alignItems: "center",
                    position: "absolute",
                    bottom: 130,
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
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      );
    }
  }
}

const Skeleton = ({ width, height, style }) => {
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
          backgroundColor: "rgba(0,0,0,0.12)",
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
          colors={["transparent", "rgba(0,0,0,0.05)", "transparent"]}
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
