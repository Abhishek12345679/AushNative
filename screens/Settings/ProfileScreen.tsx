import React from "react";
import { observer } from "mobx-react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import DP from "../../components/DP";
import Tag from "../../components/Tag";
import DrugStore from "../../store/CartStore";

const ProfileScreen = observer((props: any) => {
  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginHorizontal: 20,
          paddingBottom: 20,
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
        </View>
      </View>
      <FlatList
        horizontal={true}
        contentContainerStyle={{ paddingHorizontal: 20, marginBottom: 20 }}
        keyExtractor={(item) => item.value.toString()}
        data={[{ label: "Age", value: 30, bgc: "cyan" }]} // editable from edit profile screen (replace the data with )
        renderItem={(itemData) => (
          <Tag
            textColor="#fff"
            label={itemData.item.label}
            value={itemData.item.value.toString()}
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
