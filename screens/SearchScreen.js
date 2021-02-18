import { HeaderBackButton } from "@react-navigation/stack";
import React from "react";
import { useState } from "react";
import { TextInput } from "react-native";
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import { colors } from "../constants/colors";

import { gql, useLazyQuery } from "@apollo/client";
import { Button } from "react-native";

import ListItem from "../components/ListItem";
import { Platform } from "react-native";
import { ActivityIndicator } from "react-native";

const SearchScreen = ({ navigation }) => {
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

  const [searchText, setSearchText] = useState("");

  const [getMedicine, { loading, data, error }] = useLazyQuery(GET_MEDICINE);

  return (
    <ScrollView style={styles.container}>
      <SafeAreaView>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            // justifyContent: "center",
          }}
        >
          <HeaderBackButton
            tintColor="#fff"
            pressColorAndroid="#fff"
            labelVisible={false}
            onPress={() => {
              navigation.goBack();
            }}
          />
          <TextInput
            onSubmitEditing={() => {
              getMedicine({ variables: { name: searchText } });
            }}
            returnKeyType="search"
            placeholder="search here"
            placeholderTextColor="#ccc"
            value={searchText}
            onChangeText={(text) => {
              setSearchText(text);
            }}
            style={{
              // borderBottomColor: "#ccc",
              // borderBottomWidth: 0.5,
              width: "70%",
              // lineHeight: 0,
              height: Platform.OS === "ios" ? 30 : 50,
              fontSize: 16,
              color: "#fff",
              // marginTop: 10,
            }}
          />
          {/* <Button
            title="search"
            onPress={() => {
              getMedicine({ variables: { name: searchText } });
            }}
          /> */}
        </View>
        {!!data && !!!loading ? (
          data.search.drugs.map((med, index) => (
            <ListItem
              keyProp={index}
              key={index}
              saltTextStyle={{ color: "#ccc" }}
              style={{
                backgroundColor: colors.SECONDARY,
                borderBottomWidth: 0,
              }}
              titleStyle={{ color: "#fff" }}
              name={med.name}
              salt_composition={`${med.salt.substring(0, 20)}...`}
              imageUrl={med.imageUrl}
              onPress={() =>
                navigation.navigate("Drug", {
                  item: med,
                })
              }
            />
          ))
        ) : (
          <View style={styles.centered}>
            {/* <ActivityIndicator color="#fff" size={24} /> */}
          </View>
        )}
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.SECONDARY,
  },
  text: {
    color: "#fff",
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
    // flex: 1,
    // height: "100%",
  },
});

export default SearchScreen;
