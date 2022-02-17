import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Image,
} from 'react-native';

import DrugStore from '../store/CartStore';
import {observer} from 'mobx-react';

import {FontAwesome} from '@expo/vector-icons';
import {colors} from '../constants/colors';

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
        }}>
        {/* <View style={{width: '50%'}}>
          <Text style={{fontSize: 30, fontWeight: 'bold', color: '#FFF'}}>
            Medicines
          </Text>
        </View>
        <View>
          <Text style={{fontSize: 30, color: 'green', fontWeight: 'bold'}}>
            ₹{total_checkout_amt.toFixed(2)}
          </Text>
        </View> */}
      </View>
      {drugs.length > 0 ? (
        <>
          {drugs.map((drug, index) => (
            <View
              key={index}
              style={{
                flexDirection: 'column',
                backgroundColor: '#fff',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginEnd: 10,
                  marginTop: 10,
                  borderRadius: 20,
                }}>
                <Image
                  source={{uri: drug.imageUrl}}
                  style={{
                    width: 75,
                    height: 75,
                    marginEnd: 10,
                  }}
                />
                <View style={{marginEnd: 10}}>
                  <Text style={{fontSize: 20, fontWeight: 'bold'}}>
                    {drug.name}
                  </Text>
                  <Text style={{fontSize: 15, width: 200}}>{drug.salt}</Text>
                </View>
              </View>

              <View style={{marginStart: 10, marginVertical: 10}}>
                {/* <QuantitySelector /> */}
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: 10,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-around',
                    }}>
                    <Text style={{color: 'green'}}>₹ {drug.price}</Text>
                    <Text> x {drug.quantity} = </Text>
                    <Text style={{color: 'green', fontWeight: 'bold'}}>
                      ₹{drug.total_amt.toFixed(2)}
                    </Text>
                  </View>
                  <FontAwesome
                    name="trash"
                    size={24}
                    onPress={() => {
                      console.log(drug.id);
                      removeFromCart(drug.id);
                    }}
                  />
                </View>
              </View>
            </View>
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
            backgroundColor: '#fff',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.scanButton}
            onPress={() => {
              props.navigation.navigate('Scan');
            }}>
            <Text style={{color: '#fff', fontWeight: '500', fontSize: 17}}>
              Scan
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={submitOrder}
            style={{
              width: '100%',
              height: 70,
              backgroundColor: '#fff',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 10,
            }}>
            {!checkingOut ? (
              <Text style={{color: '#fff', fontSize: 20}}>Checkout</Text>
            ) : (
              <View>
                <ActivityIndicator size="large" color="#fff" />
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
