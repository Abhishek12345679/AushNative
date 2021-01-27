import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StatusBar,
  StyleSheet,
  ActivityIndicator,
  Button,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  Linking,
} from "react-native";

import ListItem from "../components/ListItem";

import RoundButton from "../components/RoundButton";

import { gql, useQuery } from "@apollo/client";

import { Ionicons, AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
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

  console.log(ocr_data);

  const [isVisible, setIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [importing, setImporting] = useState(false);

  if (mode === "name" || mode === "scan") {
    var { loading, data, error } = useQuery(GET_MEDICINE, {
      variables: { name: ocr_data },
    });
    console.log(data);
  } else if (mode === "salt") {
    var { loading, data, error } = useQuery(GET_ALTERNATE_DRUG, {
      variables: { salt: ocr_data },
    });
    console.log(data);
  }

  // const { loading, data, error } = queryResponse;

  // const { loading, data, error } = useQuery(GET_MEDICINE, {
  //   variables: { name: ocr_data },
  // });

  useEffect(() => {
    props.navigation.setOptions({
      //   headerRight: () => (
      //     <View style={{ flexDirection: "row" }}>
      //       <RoundButton
      //         onPress={() => props.navigation.navigate("Home")}
      //         style={{
      //           width: 30,
      //           height: 30,
      //           borderRadius: 15,
      //         }}
      //       >
      //         <AntDesign name="back" size={15} color="#fff" />
      //       </RoundButton>
      //     </View>
      //   ),
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

  // const fetchData = async () => {
  //   try {
  //     const wifiIP = "192.168.0.102";
  //     const phoneIP = "172.20.10.2";
  //     const hosted_url = `http://med-importer-real-time-js.herokuapp.com/import?searchquery=${searchQuery}`;

  //     const response = await fetch(hosted_url);
  //     const data = await response.json();
  //     // console.log(data);
  //     return data;
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  if (loading || importing) {
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
        {importing && (
          <Text>
            Fetching Meds from{" "}
            <Text
              style={{ color: "purple" }}
              onPress={() => Linking.openURL("http://google.com/1mg.com")}
            >
              {" "}
              1mg.com
            </Text>{" "}
          </Text>
        )}
        <ActivityIndicator size="large" color="#000" />
        {/* <Image
          source={{
            uri: "https://media.giphy.com/media/l3nWhI38IWDofyDrW/giphy.gif",
          }}
          style={{ height: 400, width: 400 }}
        /> */}
      </View>
    );
  }

  if (error) return;

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
            {/* <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 20,
              }}
            >
              <TextInput
                style={{
                  width: "80%",
                  borderColor: "#000",
                  color: "#000",
                  borderWidth: 2,
                  // marginBottom: 10,
                  height: 50,
                  borderRadius: 5,
                  fontSize: 15,
                  textAlign: "left",
                  paddingHorizontal: 10,
                }}
                placeholder="type somethin'"
                value={searchQuery}
                onChangeText={(text) => setSearchQuery(text)}
              />
              {!importing ? (
                <RoundButton
                  disabled={searchQuery.length == 0}
                  onPress={async () => {
                    setImporting(true);
                    const resData = await fetchData();
                    setImporting(false);
                    // setIsVisible(false);
                    if (resData.length > 0) {
                      props.navigation.navigate("Import", {
                        importedItem: resData[0].responseObj,
                      });
                    } else {
                      props.navigation.navigate("Import", {
                        importedItem: [],
                      });
                    }
                  }}
                >
                  <MaterialCommunityIcons
                    name="database-import"
                    size={24}
                    color="#fff"
                  />
                </RoundButton>
              ) : (
                <RoundButton>
                  <ActivityIndicator size="small" color="#fff" />
                </RoundButton>
              )}
            </View> */}
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
