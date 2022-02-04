import { observer } from "mobx-react";
import React from "react";
import { Text, SafeAreaView } from "react-native";

const EditProfileScreen = observer((props) => {
  return (
    <SafeAreaView
      style={{
        backgroundColor: "#fff",
        flex: 1,
        marginTop: 90,
      }}
    >
      <Text>Maintainance</Text>
    </SafeAreaView>
  );
});

export default EditProfileScreen;
