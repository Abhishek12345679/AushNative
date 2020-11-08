import { observer } from "mobx-react";
// Name,PFP and Age are hardcoded.
// FIXME: sometimes manual search comes up on swiping down

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Image } from "react-native-elements";
import DP from "../../components/DP";
import RoundButton from "../../components/RoundButton";
import Tag from "../../components/Tag";
import DrugStore from "../../store/CartStore";

const ProfileScreen = observer((props) => {
  // const { navigation } = props;
  const [date, setDate] = useState();
  const age = Math.floor((Date.now() - date) / (1000 * 60 * 60 * 24 * 365));

  // const [image, setImage] = useState(
  //   DrugStore.profile.display_picture.length === 1
  //     ? "https://toppng.com/uploads/preview/app-icon-set-login-icon-comments-avatar-icon-11553436380yill0nchdm.png"
  //     : DrugStore.profile.display_picture
  // );

  const UTCToIST = () => {
    const offset = new Date().getTimezoneOffset();
    // console.log(offset);
    const newDate = DrugStore.profile.dob;
    newDate.setMinutes(newDate.getMinutes() - offset);
    // console.log(newDate);
    setDate(newDate);
  };

  useEffect(() => {
    UTCToIST();
  }, [UTCToIST]);

  // useEffect(async () => {
  //   await DrugStore.getExtra();
  //   DrugStore.getExtra().then((res) => {
  //     console.log("res", res);
  //     setImage(res.image);
  //   });
  // }, []);

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginHorizontal: 20,
          // borderBottomColor: "#aaa",
          // borderBottomWidth: 1,
          paddingBottom: 20,
        }}
        onPress={() => {
          props.navigation.navigate("EditProfile", {
            screen: "Edit Profile",
            params: { dob: age },
          });
        }}
      >
        <View style={{ width: "100%" }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  marginVertical: 5,
                }}
              >
                {DrugStore.profile.name}
              </Text>
              <Text style={{ color: "#000" }}>
                {DrugStore.userCredentials.email}
              </Text>
            </View>
            <DP
              inner={{ width: 100, height: 100, borderRadius: 50 }}
              outer={{ width: 110, height: 110, borderRadius: 55 }}
            />
          </View>
          {/* <View
            style={{
              flexDirection: "row",
              marginTop: 10,
              width: 100,
              // flex: 1,
            }}
          >
            <Tag label="Age" value={age} bgc="pink" />
            <Tag label="Height" value={age} bgc="skyblue" />
            <Tag label="Weight" value={age} bgc="skyblue" />
            <Tag label="Weight" value={age} bgc="skyblue" />
            <Tag label="Weight" value={age} bgc="skyblue" />
          </View> */}
        </View>
      </View>
      <FlatList
        horizontal={true}
        contentContainerStyle={{ paddingHorizontal: 20, marginBottom: 20 }}
        keyExtractor={(item) => item.value}
        data={[{ label: "Age", value: 30, bgc: "cyan" }]} // editable from edit profile screen (replace the data with )
        renderItem={(itemData) => (
          <Tag
            label={itemData.item.label}
            value={itemData.item.value}
            bgc={itemData.item.bgc}
          />
        )}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
  },
});

export default ProfileScreen;
