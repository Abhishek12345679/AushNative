import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

const Card = (props) => {
  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.image}>
        <Image
          source={{
            uri:
              "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Nietzsche187a.jpg/800px-Nietzsche187a.jpg",
          }}
          style={{ flex: 1, resizeMode: "contain" }}
        />
      </View>

      <View style={{ height: "20%", marginTop: 5 }}>
        <Text style={{ color: "#000" }}>{props.name}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: 100,
    height: 100,
    flexDirection: "column",
    marginHorizontal: 8,
    marginTop: 20,
    justifyContent: "space-around",
    alignItems: "center",
  },
  image: {
    height: "85%",
    width: "100%",
    backgroundColor: "#000",
    borderRadius: 5,
  },
});

export default Card;
