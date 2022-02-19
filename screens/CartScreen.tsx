import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
} from 'react-native';

import DrugStore from '../store/CartStore';
import { observer } from 'mobx-react';

import { colors } from '../constants/colors';
import CartItem from '../components/CartItem';
import BigButton from '../components/BigButton';

const CartScreen = observer((props: any) => {

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      {DrugStore.drugs.length > 0 ? (
        <>
          {DrugStore.drugs.map((drug, index) => (
            <CartItem
              key={index}
              drug={drug}
              keyProp={index}
              removeFromCart={() => DrugStore.removeFromCart(drug.id)}
            />
          ))}
        </>
      ) : (
        <View style={styles.centered}>
          <Text style={{ color: '#fff', fontSize: 20 }}>
            No items in the cart
          </Text>
        </View>
      )}
      {DrugStore.drugs.length > 0 && (
        <View
          style={{
            flex: 1,
            backgroundColor: colors.PRIMARY,
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}>
          <BigButton
            text="Checkout"
            onPress={() => {
              props.navigation.navigate('CheckoutFlow');
            }}
            buttonStyle={{
              backgroundColor: "skyblue"
            }}
          />
        </View>
      )}
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.PRIMARY,
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CartScreen;
