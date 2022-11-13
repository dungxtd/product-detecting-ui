export default ({ config }) => {
    return {
        ...config,
        name: 'product-detecting-ui',
        version: '1.0.0',
        extra: {
            "apiUrl": "http://192.168.2.103:8080",
            "eas": {
                "projectId": "c9066439-551c-4d32-8731-f4ffec417edf"
            },
        },
    };
};