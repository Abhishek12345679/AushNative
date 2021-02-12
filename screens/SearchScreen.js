import { HeaderBackButton } from "@react-navigation/stack";
import React from "react";
import { useState } from "react";
import { TextInput } from "react-native";
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import { colors } from "../constants/colors";

import { gql, useLazyQuery } from "@apollo/client";

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
  const [medicines, setMedicines] = useState([]);

  const changeText = (text) => {
    setSearchText(text);
  };

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

              console.log(JSON.stringify(data.search.drugs, null, 2));
              if (!loading && data) setMedicines(data.search.drugs);
              setSearchText("");
            }}
            returnKeyType="search"
            placeholder="search here"
            placeholderTextColor="#ccc"
            value={searchText}
            onChangeText={(text) => {
              changeText(text);
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
        </View>
        <Text>{searchText}</Text>
        {medicines && medicines.map((med) => <Text>{med.name}</Text>)}
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
