import React from 'react';
import { SafeAreaView, Text } from 'react-native';
import BigButton from '../../components/BigButton';
import { colors } from '../../constants/colors';

const OrderSuccessScreen = (props: any) => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.PRIMARY,
        paddingHorizontal: 20,
        paddingTop: 20
      }}
    >
      <Text
        style={{
          color: "#fff",
          fontSize: 50,
          fontWeight: 'bold'
        }}
      >
        Wohooo! Order Placed 🥳
      </Text>
      <BigButton
        text="Continue Shopping"
        onPress={() => {
          props.navigation.navigate("HomeScreen")
        }}
        buttonStyle={{
          backgroundColor: "skyblue",
          marginVertical: 50
        }}
      />
    </SafeAreaView>
  );
};

export default OrderSuccessScreen;
