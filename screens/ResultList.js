import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StatusBar,
  StyleSheet,
  Button,
  TouchableOpacity,
  Image,
  ScrollView,
  Linking,
} from "react-native";

import ListItem from "../components/ListItem";

import { gql, useQuery } from "@apollo/client";

import IconBadge from "react-native-icon-badge";
import DrugStore from "../store/CartStore";
import { observer } from "mobx-react";

const GET_MEDICINE = gql`
  query getMedicine($name: String!) {
    search(name: $name) {
      drugs {
        id
        name
        salt
        price
        habit_forming
        requires_prescription
        manufacturer_name
        description {
          introduction
          uses
          side_effects
          how_to_cope_with_side_effects {
            question
            answer
          }
          how_to_use
          how_does_it_work
          safety_advice {
            question
            answer
          }
        }
      }
      items
    }
  }
`;

const GET_ALTERNATE_DRUG = gql`
  query getAlternateDrug($salt: String!) {
    findDrugForSameSalt(salt: $salt) {
      drugs {
        id
        name
        salt
        price
        habit_forming
        requires_prescription
        manufacturer_name
        description {
          introduction
          uses
          side_effects
          how_to_cope_with_side_effects {
            question
            answer
          }
          how_to_use
          how_does_it_work
          safety_advice {
            question
            answer
          }
        }
      }
      items
    }
  }
`;

const ResultList = observer((props) => {
  // let imported_res = null;
  let ocr_data = "";

  const mode = props.route.params.mode;
  console.log("mode", mode);

  if (props.route.params.manual_search) {
    ocr_data = props.route.params.query;
  } else {
    ocr_data = props.route.params.data;
  }

  console.log("ocr_data", ocr_data);

  if (mode === "name" || mode === "scan") {
    var { loading, data, error } = useQuery(GET_MEDICINE, {
      variables: { name: ocr_data },
    });
    // console.log("data", data);
  } else if (mode === "salt") {
    var { loading, data, error } = useQuery(GET_ALTERNATE_DRUG, {
      variables: { salt: ocr_data },
    });
    // console.log(data);
  }

  useEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate("Cart");
          }}
        >
          <IconBadge
            MainElement={
              <Image
                source={require("../assets/bag.png")}
                style={{ height: 25, width: 25, marginTop: 0 }}
              />
            }
            BadgeElement={
              <Text style={{ color: "#FFFFFF" }}>{DrugStore.count}</Text>
            }
            IconBadgeStyle={{
              width: 10,
              height: 20,
              backgroundColor: "purple",
              marginTop: 5,
            }}
            Hidden={DrugStore.count == 0}
          />
        </TouchableOpacity>
      ),
    });
  }, []);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          // height: "75%",
          // width: "100%",
          backgroundColor: "#fff",
        }}
      >
        <Text> loading....</Text>
      </View>
    );
  }

  if (error) {
    console.log(error);
    return;
  }

  // console.log(data);

  return (
    <View style={styles.container}>
      {Platform.OS === "ios" && (
        <StatusBar barStyle="dark-content" backgroundColor="#000" />
      )}

      {data ? (
        (
          mode === "name" || mode === "scan"
            ? data.search.items > 0
            : data.findDrugForSameSalt.items > 0
        ) ? (
          <FlatList
            ListHeaderComponent={
              <View style={{ marginVertical: 10, marginStart: 5 }}>
                <Text
                  style={{ fontSize: 15, fontWeight: "bold", color: "#000" }}
                >
                  {mode === "name" || mode === "scan"
                    ? data.search.items
                    : data.findDrugForSameSalt.items}{" "}
                  Meds found
                </Text>
              </View>
            }
            data={
              mode === "name" || mode === "scan"
                ? data.search.drugs
                : data.findDrugForSameSalt.drugs
            }
            renderItem={(itemData) => {
              return (
                <ListItem
                  name={itemData.item.name}
                  salt_composition={`${itemData.item.salt.substring(0, 20)}...`}
                  imageUrl={itemData.item.imageUrl}
                  onPress={() =>
                    props.navigation.navigate("Drug", {
                      item: itemData.item,
                    })
                  }
                />
              );
            }}
          />
        ) : (
          <ScrollView style={styles.containerEmpty}>
            <Text style={{ color: "#000", fontWeight: "400" }}>
              No Drugs Found in Chemy's Database, enter the drug as accuarate as
              possible in the search bar below
            </Text>

            <Button
              title="return"
              onPress={() => {
                props.navigation.pop();
              }}
            />
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                marginVertical: 50,
              }}
            >
              <Image
                source={require("../assets/nomed.png")}
                style={{ height: 300, width: 200 }}
              />
            </View>
          </ScrollView>
        )
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginVertical: 50,
          }}
        >
          <Image
            source={require("../assets/nomed.png")}
            style={{ height: 300, width: 200 }}
          />
          <Text>
            Courtesy :{" "}
            <Text
              style={{
                color: "purple",
                textDecorationLine: "underline",
              }}
              onPress={() => Linking.openURL("https://www.1mg.com")}
            >
              1mg.com
            </Text>
          </Text>
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  containerEmpty: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
    // justifyContent: "center",
    // alignItems: "center",
  },
  content: {
    alignItems: "center",
    marginTop: 5,
    flexDirection: "column",
  },
  imageContainer: {
    width: "95%",
    backgroundColor: "#000",
    height: 200,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  bigTitle: {
    fontSize: 50,
    fontWeight: "600",
    color: "#fff",
  },
  salt: {
    fontSize: 20,
    fontWeight: "400",
    color: "#000",
  },
  row: {
    width: "100%",
    justifyContent: "space-between",
    flexDirection: "row",
    marginHorizontal: 10,
    alignItems: "center",
    paddingHorizontal: 25,
    marginTop: 10,
  },
  buyBtn: {
    width: "80%",
    height: 60,
    backgroundColor: "#e75468",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    paddingHorizontal: 50,
    alignItems: "center",
    borderRadius: 15,
  },
  desc: {
    justifyContent: "flex-start",
    paddingHorizontal: 25,
    marginTop: 10,
  },
});

export const screenOptions = () => {
  return {
    headerLargeTitle: true,
    gestureEnabled: false,
    headerHideBackButton: true,
    headerShown: true,
    // headerTranslucent: true,
  };
};

export default ResultList;
