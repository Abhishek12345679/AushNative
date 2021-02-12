import { HeaderBackButton } from "@react-navigation/stack";
import React from "react";
import { useState } from "react";
import { TextInput } from "react-native";
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import { colors } from "../constants/colors";

import { gql, useLazyQuery } from "@apollo/client";
import { Button } from "react-native";

import ListItem from "../components/ListItem";

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
        <Text>Loading</Text>
      </View>
    );
  }

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
            labelVisible={false}
            onPress={() => {
              navigation.goBack();
            }}
          />
          <TextInput
            onSubmitEditing={() => {
              // console.log(text);
              getMedicine({ variables: { name: searchText } });
              // console.log(JSON.stringify(data.search.drugs, null, 2));
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
              lineHeight: 0,
              height: 30,
              fontSize: 16,
              color: "#fff",
            }}
          />
          <Button
            title="search"
            onPress={() => {
              // console.log(text);
              getMedicine({ variables: { name: searchText } });
              // if (data) {
              //   console.log(JSON.stringify(data.search.drugs, null, 2));
              //   setMedicines(data.search.drugs);
              // }
            }}
          />
        </View>
        {/* <Text>{searchText}</Text> */}
        {!!data &&
          !!!loading &&
          data.search.drugs.map((med) => (
            <ListItem
              saltTextStyle={{ color: "#ccc" }}
              style={{ backgroundColor: colors.SECONDARY }}
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
          ))}
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
});

export default SearchScreen;
