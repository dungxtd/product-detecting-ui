export default ({ config }) => {
    return {
        ...config,
        name: 'product-detecting-ui',
        version: '1.0.0',
        extra: {
            "apiUrl": "http://192.168.2.103:8080",
            "fireBaseConfig": {
                apiKey: "AIzaSyBoV3zgLbSXy6VscXSp5k4F_GYH1KIZe5Y",
                authDomain: "supermarket-product-detecting.firebaseapp.com",
                databaseURL: "https://supermarket-product-detecting-default-rtdb.asia-southeast1.firebasedatabase.app",
                projectId: "supermarket-product-detecting",
                storageBucket: "supermarket-product-detecting.appspot.com",
                messagingSenderId: "962736260131",
                appId: "1:962736260131:web:4cc0ad0ebf6901d7d71d96",
                measurementId: "G-95RJJ3ZEPY"
            },
            "eas": {
                "projectId": "c9066439-551c-4d32-8731-f4ffec417edf"
            },
        },
    };
};