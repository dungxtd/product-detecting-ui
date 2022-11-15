import React, { Component, useEffect, useRef } from "react";
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
  TouchableWithoutFeedback,
} from "react-native";
import Constants from "expo-constants";
import { Camera, CameraType } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";
import { Ionicons } from "@expo/vector-icons";
import { decode as atob, encode as btoa } from "base-64";
import * as ImagePicker from "expo-image-picker";
import ReactNativeZoomableView from "@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView";
export default class TabOneScreen extends React.Component {
  camera: any;
  state = {
    deviceWidth: Dimensions.get("window").width,
    hasCameraPermission: null,
    constants: Constants,
    type: CameraType.back,
    takenImage: null,
    loading: false,
    productsSuggested: [],
    tracked: false,
    productsName: null,
    objectDetected: null,
  };
  /**
   *
   * @param objectDetected
   */
  reTracking(objectDetected: object) {
    this.setState({
      productsSuggested: [],
      takenImage: null,
      loading: false,
      tracked: false,
      productsName: null,
      objectDetected: null,
    });
  }
  /**
   * s
   */
  async componentDidMount() {
    const me = this;
    const { status } = await Camera.requestCameraPermissionsAsync();
    this.setState({ hasCameraPermission: status === "granted" });
    let response_api = `{"objectDetected":{"detected":[{"box":[27.33333396911621,276.5,54,167],"label":"DAUGOI_DOVE_55","value":0.2}],"max":{"box":[27.33333396911621,276.5,54,167],"label":"DAUGOI_DOVE_55","value":0.2}},"productsName":{"Key":"DAUGOI_DOVE","Word":"dầu gội DOVE"},"productsSuggested":[{"link":"https://www.google.com/url?q=https://tiki.vn/tu-hoc-nhanh-word-2007-p440931.html%3Fspid%3D22650309&sa=U&ved=0ahUKEwj-wd7DpKv7AhUVEkQIHaMGCNwQ2SkIQw&usg=AOvVaw1hc7lgzBtQOY7v5Z5CvKob","origin":"từ tiki.vn","price":39000,"price-text":"39.000 ₫","shipping":"","source":"https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQtaDDXb6bK-y-ksS5zjavMVm5YNHN5Bo347B_8ibmsIcJ7nSpEXFuWDjQnrlI-lgMPeqbg&usqp=CAE","title":"[Rẻ Hơn Hoàn Tiền] - Tự Học Nhanh Word 2007"},{"link":"https://www.google.com/url?q=https://shopee.vn/S%25C3%25A1ch-Microsoft-Office-Word-2016-i.142856269.16283172550&sa=U&ved=0ahUKEwj-wd7DpKv7AhUVEkQIHaMGCNwQ2SkIRg&usg=AOvVaw1ZBRgG6VT1OxCZhv2Tj1a9","origin":"từ Shopee","price":78000,"price-text":"78.000 ₫","shipping":"","source":"https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcS1NrKhvY9iRiPkbbEmw4sW_ZMHNWO5o1zBxne33k0jk3Bmq6ZvzBRhw87028p-CptRXHzA&usqp=CAE","title":"Sách Microsoft Office Word 2016"},{"link":"https://www.google.com/url?q=https://www.fabico.vn/products/tu-hoc-nhanh-microsoft-office-word-excel%3Fvariant%3D1077796083%26source%3Dgoogleshop&sa=U&ved=0ahUKEwj-wd7DpKv7AhUVEkQIHaMGCNwQ2SkISQ&usg=AOvVaw1bnICnoNfpprh4CO4X1NFo","origin":"từ fabico.vn","price":156000,"price-text":"156.000 ₫","shipping":"","source":"https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQGSYtXiAjWO8_lmIluUI_K4KrPAqGFhBlXO05o8FY5HFfxKjecPXELztmN4FS7g6xjmhVe&usqp=CAE","title":"Tự Học Nhanh, Microsoft Office (Word - Excel)"},{"link":"https://www.google.com/url?q=https://www.lazada.vn/products/phan-mem-office-home-student-2021-dung-vinh-vien-danh-cho-1-nguoi-1-thiet-bi-word-excel-powerpoint-i985992143-s3129670238.html&sa=U&ved=0ahUKEwj-wd7DpKv7AhUVEkQIHaMGCNwQ2SkITA&usg=AOvVaw2LvXIUQCbdOtncENHxMwHw","origin":"từ Lazada Vietnam","price":2150000,"price-text":"2.150.000 ₫","shipping":"Vận chuyển miễn phí","source":"https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQagGK7pLueoo8SFp12UoCAoecbPq_ql7N8ixQiCe6YyDHi-HZpCm9feEE&usqp=CAE","title":"Phần mềm Office Home & Student 2021 |Dùng vĩnh viễn| Dành cho 1 người 1 thiết bị |Word Excel PowerPoint"},{"link":"https://www.google.com/url?q=https://tiki.vn/huong-dan-su-dung-microsoft-office-tu-hoc-nhanh-word-excel-p134526284.html%3Fspid%3D134526285&sa=U&ved=0ahUKEwj-wd7DpKv7AhUVEkQIHaMGCNwQ2SkITw&usg=AOvVaw338LMkzagjoPfhqtYOhv11","origin":"từ tiki.vn","price":144000,"price-text":"144.000 ₫","shipping":"","source":"https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcS-SPJwMxATWYsUGfIxwIMX5gwKZ22VEWYayXdFz26VRgHZRjOyfcV9b7So53ki7EmS_s2j1g&usqp=CAE","title":"[Rẻ Hơn Hoàn Tiền] - Hướng Dẫn Sử Dụng Microsoft Office Tự Học Nhanh Word- Excel"},{"link":"https://www.google.com/url?q=https://nhanvan.vn/products/huong-dan-su-dung-microsoft-office-tu-hoc-nhanh-word-excel-dung-cho-cac-phien-ban-2021-2019-2016%3Futm_content%3Dhuong-dan-su-dung-microsoft-office-tu-hoc-nhanh-word-excel-dung-cho-cac-phien-ban-2021-2019-2016%26utm_source%3Dgoogleads%26utm_medium%3Dcpc%26utm_campaign%3Dproductfeeds%26utm_term%3Dnhanvan%26srsltid%3DAYJSbAfF8zdJF5TAacJQ8Bam1WYHrxIDgA0SJfif_iQKdtQRwV8jyvdTYZo&sa=U&ved=0ahUKEwj-wd7DpKv7AhUVEkQIHaMGCNwQ2SkIUg&usg=AOvVaw2QdLZTM_QQ5M36lXl9q46x","origin":"từ nhanvan.vn","price":169200,"price-text":"169.200 ₫","shipping":"+ 33.840 ₫ phí giao hàng","source":"https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQnopCQaGhVLhw09dn-EQtI_3nOCGePOmt3QM5W3YY9h7vbd2WGNils-dzKQOEVgUYsCVtu&usqp=CAE","title":"Hướng Dẫn Sử Dụng Microsoft Office - Tự Học Nhanh Word-Excel - Dùng Cho Các Phiên Bản"},{"link":"https://www.google.com/url?q=https://somehow.vn/products/jogger-bg-word-stickers%3Fvariant%3D1080712588%26source%3Dgoogleshop&sa=U&ved=0ahUKEwj-wd7DpKv7AhUVEkQIHaMGCNwQ2SkIVQ&usg=AOvVaw3y65D3iU3M8oA3e3LfXJOb","origin":"từ somehow.vn","price":350000,"price-text":"350.000 ₫","shipping":"","source":"https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcSiyzwW7sJmTwvTuZecv7ru1Yegp6H91700Wz-s8Tm8sJpAjqBjKYYpvO_JzIFKIcbE7x20&usqp=CAE","title":"Jogger BG Word Stickers -Đen / XL"},{"link":"https://www.google.com/url?q=https://tiki.vn/huong-dan-su-dung-microsoft-office-tu-hoc-nhanh-wordexcel-dung-cho-cac-phien-ban-202120192016-p146274085.html%3Fspid%3D172129049&sa=U&ved=0ahUKEwj-wd7DpKv7AhUVEkQIHaMGCNwQ2SkIWA&usg=AOvVaw2_Q4w6_z6F9G4IbnwhVrum","origin":"từ tiki.vn","price":146640,"price-text":"146.640 ₫","shipping":"","source":"https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcRQRXiBOsejvRNJGrT7vPsla8LvdKLvToCP5BDTNVhtzMkZOiOYBsZZGyMlFPzfdhNFXoMZ&usqp=CAE","title":"[Rẻ Hơn Hoàn Tiền] - Hướng Dẫn Sử Dụng Microsoft Office - Tự Học Nhanh Word-Excel - Dùng Cho Các Phiên Bản 2021-2019-2016"},{"link":"https://www.google.com/url?q=https://www.fahasa.com/tu-hoc-nhanh-word-2007.html%3Fsrsltid%3DAYJSbAcKuetYzgkor2lLnfG0ExtTPbK3_kiWjgLEraF9DEPYTUSzuEPz4_Q&sa=U&ved=0ahUKEwj-wd7DpKv7AhUVEkQIHaMGCNwQ2SkIWw&usg=AOvVaw1pMJwjZ8eO1dPxr4GtXMmE","origin":"từ Fahasa","price":41000,"price-text":"41.000 ₫","shipping":"+ 20.000 ₫ phí giao hàng","source":"https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSHYPShi-OF7z-PzFyqG0U_qpz9OMdxsSP8wOaoZv6RfrftRp-0SYnSodI&usqp=CAE","title":"Tự Học Nhanh Word 2007 - Danh mục Tin học - Tác giả Hà Thành, Trí Việt"},{"link":"https://www.google.com/url?q=https://shopee.vn/-M%25C3%25A3-ELMALL3-gi%25E1%25BA%25A3m-3--%25C4%2591%25C6%25A1n-3TR--Ph%25E1%25BA%25A7n-m%25E1%25BB%2581m-Microsoft-Office-Home---Business-v%25C4%25A9nh-vi%25E1%25BB%2585n-Word--Excel--PowerPoint-%257C-Outlook-i.286157142.5044273659&sa=U&ved=0ahUKEwj-wd7DpKv7AhUVEkQIHaMGCNwQ2SkIXg&usg=AOvVaw3uNoKMAuYcEvX3XWdyhFDB","origin":"từ Shopee","price":5550000,"price-text":"5.550.000 ₫","shipping":"","source":"https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcSX2wKqmjOGYgGQ52dNF2e7KfAoUK0sQL_JrVhLZBT5TUfPsBEhSN3oYhpHAfs97atu88IktA&usqp=CAE","title":"[Mã ELMALL3 giảm 3% đơn 3TR] Phần mềm Microsoft Office Home & Business vĩnh viễn Word, Excel, PowerPoint | Outlook"},{"link":"https://www.google.com/url?q=https://tiki.vn/huong-dan-su-dung-microsoft-office-tu-hoc-nhanh-word-excel-p177891379.html%3Fspid%3D177891380&sa=U&ved=0ahUKEwj-wd7DpKv7AhUVEkQIHaMGCNwQ2SkIYQ&usg=AOvVaw1m4zpZ9ZaxtceMGM57ZeOd","origin":"từ tiki.vn","price":163000,"price-text":"163.000 ₫","shipping":"","source":"https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQ3P5QZT2bV4Q1cig2tcX-xLJjn0FwMykv7PuyEZ3vmbMl-saF6q-fNaxfIYHKCgGxzvFFd&usqp=CAE","title":"Hướng Dẫn Sử Dụng Microsoft Office - Tự Học Nhanh Word - Excel"},{"link":"https://www.google.com/url?q=https://shopee.vn/B%25E1%25BB%2599-board-word-8-ch%25E1%25BB%25A7-%25C4%2591%25E1%25BB%2581-k%25C3%25A8m-Mp3-i.71624600.9510754260&sa=U&ved=0ahUKEwj-wd7DpKv7AhUVEkQIHaMGCNwQ2SkIZA&usg=AOvVaw1F1Vwht5WvAACckNyMlHBy","origin":"từ Shopee","price":45000,"price-text":"45.000 ₫","shipping":"","source":"https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcTorD1e8rFe4eua-rtYCke_C16Q4JMI9yt1epPLh6bR3wFFk-St3Aqc1EUD&usqp=CAE","title":"Bộ board word 8 chủ đề kèm Mp3"},{"link":"https://www.google.com/url?q=https://www.sendo.vn/lap-rap-1-hop-legominecraff-my-word-1033-co-nhieu-chi-tiet-bang-nhua-abs-rat-dep-39206722.html%3Futm_content%3Ddochoi-dochoiphattrientritue-dochoilaprap-gg&sa=U&ved=0ahUKEwj-wd7DpKv7AhUVEkQIHaMGCNwQ2SkIZw&usg=AOvVaw0V8JK6uDfA_LLpHN2T06XQ","origin":"từ Sendo.vn","price":55000,"price-text":"55.000 ₫","shipping":"Vận chuyển miễn phí","source":"https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcR4p2491N8UCR1WRNqOl3MkTamfBkasD3NjGzcjvG9dCw13giUQ7CAqN7w&usqp=CAE","title":"Lắp Ráp 1 Hộp Legominecraff My Word 1033 Có Nhiều Chi Tiết Bằng Nhựa Abs Rất Đẹp- Đủ Loại/Màu - Chất Lượng Cao - Còn Hàng"},{"link":"https://www.google.com/url?q=https://nhanvan.vn/products/huong-dan-su-dung-microsoft-office-tu-hoc-nhanh-word-excel-dung-cho-cac-phien-ban-2021-2019-2016%3Fvariant%3D1078796579%26source%3Dgoogleshop%26utm_campaign%3Dsmart_shopping%26utm_medium%3Dcpc%26utm_source%3Dgoogle%26srsltid%3DAYJSbAfQJ_KVXdcLTYmvej389Fqy8aBdXxbnZYU3Jw_p6hSD9gtpzghB07I&sa=U&ved=0ahUKEwj-wd7DpKv7AhUVEkQIHaMGCNwQ2SkIag&usg=AOvVaw17E3s0gbG6Np_Qfv-M4Zqf","origin":"từ nhanvan.vn","price":169200,"price-text":"169.200 ₫","shipping":"+ 33.840 ₫ phí giao hàng","source":"https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQfCkD33UXWn3QnukHky99VXjeQuwL7Rm3_yfdgRmpXupwMYj0sklr3i3wZ-Qs4yVtx8Wc4Ew&usqp=CAE","title":"[GIÁ TỐT] - Hướng Dẫn Sử Dụng Microsoft Office - Tự Học Nhanh Word-Excel - Dùng Cho Các Phiên Bản 2021-2019-2016"},{"link":"https://www.google.com/url?q=https://tiki.vn/hinh-dan-cute-sticker-de-thuong-game-gacha-80-mieng-dan-mini-word-trang-tri-p188407658.html%3Fspid%3D188407659&sa=U&ved=0ahUKEwj-wd7DpKv7AhUVEkQIHaMGCNwQ2SkIbQ&usg=AOvVaw23NNuL8NJxbc6utuiOEaJW","origin":"từ tiki.vn","price":17000,"price-text":"17.000 ₫","shipping":"","source":"https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQ2jMvI2fP0MR9Pz6IALYKbT0m0AoVZRE2mEY8KxsnM23oYCesOXHnyyq4t&usqp=CAE","title":"[Rẻ Hơn Hoàn Tiền] - Hình dán cute Sticker dễ thương game Gacha 80 miếng dán mini word trang trí"},{"link":"https://www.google.com/url?q=https://shopee.vn/S%25C3%25A1ch-T%25E1%25BB%25B1-H%25E1%25BB%258Dc-Nhanh-Word-2007-i.142856269.8245033551&sa=U&ved=0ahUKEwj-wd7DpKv7AhUVEkQIHaMGCNwQ2SkIcA&usg=AOvVaw1X8WMQ_qG9e025_noiZhg8","origin":"từ Shopee","price":39000,"price-text":"39.000 ₫","shipping":"","source":"https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcS4WAkPj69MQ1dPRm1WYBtNhoH9bIpv3YwMxv9Q-OOccmDVl1ARcjqWHMRRSGU0qrePT29OVw&usqp=CAE","title":"Sách Tự Học Nhanh Word 2007"},{"link":"https://www.google.com/url?q=https://www.lazada.vn/products/tra-gop-0phan-mem-office-home-business-2021-dung-vinh-vien-danh-cho-1-nguoi-1-thiet-bi-word-excel-powerpoint-outlook-i1588988323-s6784318503.html&sa=U&ved=0ahUKEwj-wd7DpKv7AhUVEkQIHaMGCNwQ2SkIcw&usg=AOvVaw0fOl8LhxpEdibOuVIGT_le","origin":"từ Lazada Vietnam","price":5090000,"price-text":"5.090.000 ₫","shipping":"Vận chuyển miễn phí","source":"https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCNhx1NeFZIOVFrpQ7W_lh2n8tlIjYYyQRoC_Y4z-8Ua3qMYSTIhll6dr5doNnwoa8tyxBEQ&usqp=CAE","title":"[Trả góp 0%] Phần mềm Office Home & Business 2021 |Dùng vĩnh viễn| Dành cho 1 người 1 thiết bị | Word Excel PowerPoint | Outlook"},{"link":"https://www.google.com/url?q=https://hangchinhhieu.vn/products/phan-mem-office-home-business-2021-dung-vinh-vien-danh-cho-1-nguoi-1-thiet-bi-word-excel-powerpoint-outlook%3Fvariant%3D1078380407%26source%3Dgoogleshop%26utm_source%3DShopping&sa=U&ved=0ahUKEwj-wd7DpKv7AhUVEkQIHaMGCNwQ2SkIdg&usg=AOvVaw0c9asRYk9IgDCFbhmRM6Yd","origin":"từ Hangchinhhieu.vn","price":5390000,"price-text":"5.390.000 ₫","shipping":"","source":"https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQUgIZ9u9zKUCwZ_2ND_LvKaZ4hSi--W1aYgmhrj6VkxYz62TD1UA0bvm0PylL3ZDppfvCt&usqp=CAE","title":"Phần mềm Office Home & Business 2021 |Dùng vĩnh viễn| Dành cho 1 người, 1 thiết bị | Word, Excel, PowerPoint | Outlook -Phần mềm chính hãng"},{"link":"https://www.google.com/url?q=https://www.sendo.vn/ma-code-kich-hoat-microsoft-office-standard-2019-vinh-vien-word-excel-pp-outlook-pub-onenote-021-10609-24943038.html%3Futm_content%3Dvoucherdichvu-macodephanmem-macodephanmemhedieuhanh-gg&sa=U&ved=0ahUKEwj-wd7DpKv7AhUVEkQIHaMGCNwQ2SkIeQ&usg=AOvVaw0DiGNlPagjNclCbAu-BOAq","origin":"từ Sendo.vn","price":10360000,"price-text":"10.360.000 ₫","shipping":"Vận chuyển miễn phí","source":"https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcSTC6gYFqImUbiegyJTpDQNlMYbQjaf-kLid1Zu-k4CIa-cGneRkPk2hITb&usqp=CAE","title":"Mã Code Kích Hoạt Microsoft Office Standard 2019 Vĩnh Viễn Word, Excel, Pp, Outlook, Pub, Onenote 021-10609- Đủ Loại/Màu - Chất Lượng Cao - Còn Hàng"},{"link":"https://www.google.com/url?q=https://mimigame.vn/products/5036-classic-word-games-6987&sa=U&ved=0ahUKEwj-wd7DpKv7AhUVEkQIHaMGCNwQ2SkIfA&usg=AOvVaw1GVlFuRFA-yQ4YsdFWVgqY","origin":"từ MimiGame Shop","price":5000,"price-text":"5.000 ₫","shipping":"","source":"https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcSaQcQUB6L3avRMuPsJbI_OxFsgpZ6MHrLljoGdff_LR6I72QYxay1la3pAJVg2_vN9mRA8&usqp=CAE","title":"5036 - Classic Word Games"}]}`;
    response_api = JSON.parse(response_api);
    me.setState({
      takenImage:
        "https://i.pinimg.com/564x/d4/83/be/d483be6dc00b4c3986fec3c8c1a58201.jpg",
      loading: false,
      productsSuggested: response_api.productsSuggested ?? [],
      tracked: true,
      productsName: response_api.productsName ?? null,
      objectDetected: response_api.objectDetected?.max ?? null,
    });
  }
  /**
   * take picture and tracking image
   */
  takePicture = async () => {
    const me = this;
    if (me.camera) {
      this.camera.takePictureAsync().then((res) => {
        me.setState({ takenImage: res.uri, loading: true });
        me.onProcess(res.uri);
      });
    }
  };
  pickImage = async () => {
    const me = this;
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      // allowsEditing: true,
      quality: 0.5,
    });
    if (!result.canceled) {
      this.setState({
        takenImage: result.assets[0].uri,
        loading: true,
      });
      me.onProcess(result.assets[0].uri);
    }
  };
  /**
   * handle load data
   * @param photo
   */
  onProcess = async (photo: string) => {
    const me = this;
    const actions = [
      // {
      //   crop: {
      //     originX: 0,
      //     originY: 0,
      //     width: 1683, // same as the image width!
      //     height: 1683,
      //   },
      // },
    ];

    const saveOptions = {
      format: ImageManipulator.SaveFormat.JPEG,
      compress: 0.5,
      base64: true,
    };
    const compressed = await ImageManipulator.manipulateAsync(
      photo,
      [],
      saveOptions
    );
    const response_api = await me.getProductFromApi(compressed);
    console.log(response_api);
    me.setState({
      loading: false,
      productsSuggested: response_api.productsSuggested ?? [],
      tracked: true,
      productsName: response_api.productsName ?? null,
      objectDetected: response_api.objectDetected?.max ?? null,
    });
  };
  /**
   * get product info from api
   * @param compressed
   * @returns
   */
  getProductFromApi = async (compressed: object) => {
    let url =
        this.state.constants?.expoConfig?.extra?.apiUrl ??
        "http://192.168.2.103:8080",
      productTracking = {};
    // Upload the image using the fetch and FormData APIs
    let formData = new FormData();
    formData.append("file", compressed.base64);
    const requestOptions: RequestInit = {
      method: "POST",
      body: formData,
    };
    await fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        productTracking = result;
      })
      .catch((error) => console.log("error", error));
    return productTracking;
  };
  /**
   *
   * @param base64Image
   * @returns
   */
  getBinary(base64Image: string) {
    let binaryImg = atob(base64Image);
    let length = binaryImg.length;
    let ab = new ArrayBuffer(length);
    let ua = new Uint8Array(ab);
    for (let i = 0; i < length; i++) {
      ua[i] = binaryImg.charCodeAt(i);
    }
    return ab;
  }
  /**
   *
   * @returns
   */
  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
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
                    zoomEnabled={true}
                    bindToBorders={true}
                    maxZoom={1.5}
                    minZoom={0.5}
                    zoomStep={0.25}
                    // initialZoom={0.9}
                    state={{ padding: 10, backgroundColor: "#fff" }}
                  >
                    <TouchableWithoutFeedback
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
                        />
                        {this.state.objectDetected !== null &&
                          this.state.objectDetected.box !== null && (
                            <TouchableOpacity
                              activeOpacity={0.75}
                              onPress={() => {
                                console.log(1);
                              }}
                              pointerEvents={"none"}
                              style={{
                                width: 100,
                                height: 100,
                                position: "absolute",
                                left:
                                  (this.state.objectDetected.box[0] +
                                    this.state.objectDetected.box[2]) /
                                  2,
                                top:
                                  (this.state.objectDetected.box[1] +
                                    this.state.objectDetected.box[3]) /
                                  2,
                              }}
                            >
                              <Image
                                source={require("../assets/images/concentric-circles.png")}
                                style={{
                                  width: 20,
                                  height: 20,
                                  resizeMode: "center",
                                }}
                              ></Image>
                            </TouchableOpacity>
                          )}
                      </View>
                    </TouchableWithoutFeedback>
                  </ReactNativeZoomableView>
                </View>
                {/* wrap modal */}
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
                            </View>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    )}
                </View>
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
                    autoFocus={true}
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
                  <View
                    style={{
                      width: 70,
                      height: 70,
                      justifyContent: "center",
                      alignItems: "center",
                      position: "absolute",
                      bottom: 125,
                      left: 30,
                    }}
                  >
                    <TouchableOpacity
                      style={{ alignSelf: "center" }}
                      onPress={() => {
                        this.pickImage();
                      }}
                    >
                      <Image
                        source={require("../assets/images/picture.png")}
                        style={{
                          width: 30,
                          height: 30,
                          resizeMode: "center",
                        }}
                      ></Image>
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

const Skeleton = ({ width = 0, height = 0, style = {} }) => {
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
