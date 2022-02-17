import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
} from 'react-native';

import DrugStore from '../store/CartStore';
import {observer} from 'mobx-react';

import {colors} from '../constants/colors';
import CartItem from '../components/CartItem';

const CartScreen = observer(props => {
  const {drugs} = DrugStore;
  let total_checkout_amt = 0;

  const [checkingOut, setCheckingOut] = useState(false);

  for (let i = 0; i < drugs.length; i++) {
    total_checkout_amt = total_checkout_amt + drugs[i].total_amt;
  }

  const removeFromCart = id => {
    DrugStore.removeFromCart(id);
  };

  const submitOrder = () => {
    props.navigation.navigate('CheckoutFlow');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{flexGrow: 1}}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginVertical: 10,
        }}></View>
      {drugs.length > 0 ? (
        <>
          {drugs.map((drug, index) => (
            <CartItem
              drug={drug}
              keyProp={index}
              removeFromCart={() => removeFromCart(drug.id)}
            />
          ))}
        </>
      ) : (
        <View style={styles.centered}>
          <Text style={{color: '#fff', fontSize: 20}}>
            No items in the cart
          </Text>
        </View>
      )}
      {drugs.length > 0 && (
        <View
          style={{
            flex: 1,
            backgroundColor: colors.PRIMARY,
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}>
          <TouchableOpacity
            onPress={submitOrder}
            style={{
              width: '100%',
              height: 70,
              backgroundColor: colors.SECONDARY,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 10,
              borderRadius: 10,
            }}>
            {!checkingOut ? (
              <Text style={{color: '#fff', fontSize: 20, fontWeight: 'bold'}}>
                Checkout
              </Text>
            ) : (
              <View>
                <ActivityIndicator size="small" color="#fff" />
              </View>
            )}
          </TouchableOpacity>
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
