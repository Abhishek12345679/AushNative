import AsyncStorage from "@react-native-community/async-storage";

export const requestNewAuthToken = async(refToken) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    const response = await fetch(
        `https://securetoken.googleapis.com/v1/token?key=AIzaSyBI3PnHGbtsukz2gQ9c2TbBEpQ-UBTFjtU&grant_type=refresh_token&refresh_token=${refToken}`, {
            method: "POST",
            headers: myHeaders,
            redirect: "follow",
            body: JSON.stringify({
                grant_type: "refresh_token",
                refresh_token: refToken,
            }),
        }
    );

    const resData = await response.json();
    console.log("new auth data", resData);
    // DrugStore.updateAuthToken(resData.id_token);
    return resData;
};

export const updateAutoLoginData = (expTime) => {
    AsyncStorage.getItem("auto_login_data")
        .then((data) => {
            // transform it back to an object
            if (data) {
                data = JSON.parse(data);
                console.log(data);
            }

            // Decrement
            data.expirationTime = expTime * 1000;
            console.log("updated exp Time", data);

            //save the value to AsyncStorage again
            AsyncStorage.setItem("auto_login_data", JSON.stringify(data));
        })
        .done();
};