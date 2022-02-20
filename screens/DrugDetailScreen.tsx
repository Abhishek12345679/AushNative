import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  Image,
  Pressable,
} from 'react-native';

import { showMessage } from 'react-native-flash-message';

import QuantitySelector from '../components/QuantitySelector';
import { observer } from 'mobx-react';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import DrugStore, { DrugType } from '../store/CartStore';
import { colors } from '../constants/colors';
import { Popable } from 'react-native-popable';

import BigButton from '../components/BigButton'

const DrugDetailScreen = observer((props: any) => {

  const item = props.route.params.item;

  let [quantity, setQuantity] = useState('1');
  let [initialValue, setInitialValue] = useState(1);

  let [addingToCart, setAddingToCart] = useState(false);

  let [introCollapsed, setIntroCollapsed] = useState(true);
  let [usesCollapsed, setUsesCollapsed] = useState(true);
  let [sideEffectsCollapsed, setSideEffectsCollapsed] = useState(true);
  let [howToSECollpased, setHowToSECollapsed] = useState(true);
  let [howToUseCollapsed, setHowToUseCollapsed] = useState(true);
  let [safetyAdviceCollapsed, setSafetyAdviceCollapsed] = useState(true);

  const [cartCount, setCartCount] = useState(DrugStore.count);

  const onIncrease = () => {
    setQuantity((initialValue + 1).toString());
    setInitialValue(initialValue + 1);
  };

  const onDecrease = () => {
    if (initialValue >= 2) {
      setQuantity((initialValue - 1).toString());
      setInitialValue(initialValue - 1);
    }
  };

  //TODO: use UseReducer ?
  const [cartItem, setCartItem] = useState({
    id: '',
    name: '',
    salt: '',
    price: 0,
    quantity: 0,
    prescription_req: false,
    total_amt: 0,
    imageUrl: '',

  });

  const addToCart = (cartItem: DrugType) => {
    DrugStore.addDrug(cartItem);
    setCartCount(cartCount + 1);
  };

  useEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <Pressable
          style={{
            marginStart: 10,
            height: 40,
            width: 40,
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative'
          }}
          android_ripple={{
            color: "#fff",
            borderless: true
          }}
          onPress={() => {
            props.navigation.navigate('Cart');
          }}>
          <Ionicons name="md-cart" size={24} color="#fff" />
          {DrugStore.count > 0 &&
            <View
              style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                backgroundColor: "red",
                position: 'absolute',
                top: 0,
                right: 0,
                justifyContent: 'center',
                alignItems: 'center'
              }}>
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 15 }}>
                {DrugStore.count}
              </Text>
            </View>
          }
        </Pressable>
      ),
      headerTitle: item ? item.name : 'Drug',
      headerStyle: {
        backgroundColor: colors.PRIMARY,
      },
      headerTintColor: '#fff',
    });
  }, [cartCount]);

  useEffect(() => {
    setCartItem({
      id: item.id,
      imageUrl: item.image_url,
      name: item.name,
      salt: item.salt,
      price: parseFloat(parseFloat(item.price).toFixed(2)),
      quantity: parseInt(quantity),
      prescription_req: item.requires_prescription,
      total_amt:
        parseInt(quantity) * parseFloat(parseFloat(item.price).toFixed(2)),
    });
  }, [item, quantity]);

  return (
    <ScrollView style={styles.container}>
      <View style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" backgroundColor={colors.PRIMARY} />
        <View style={{ marginStart: 15, marginTop: 15 }}>
          <Text style={{ color: '#FFF', fontSize: 15, fontWeight: 'bold' }}>
            Manufacturer
          </Text>
          <Text style={{ color: '#fff' }}>{item.manufacturer_name}</Text>
        </View>
        <View style={styles.content}>
          <View style={styles.imageContainer}>
            <Image
              source={{
                uri: item.image_url,
              }}
              style={{
                height: 335,
                width: 365,
                backgroundColor: colors.PRIMARY,
                borderRadius: 20,
              }}
            />
          </View>
          <View style={styles.row}>
            <View style={{ width: '70%' }}>
              <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Salt</Text>
              <Text style={styles.salt}>{item.salt}</Text>
            </View>
            {item.requires_prescription && (
              <Popable
                animated={true}
                animationType="spring"
                action="press"
                caret={true}
                strictPosition={true}
                // position="left"
                style={{
                  width: 125,
                  left: -20
                }}
                numberOfLines={2}
                content={
                  <View
                    style={{
                      padding: 10,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#FFF',
                    }}
                  >
                    <Text style={{ color: "#FFF", fontWeight: "bold" }}>
                      Prescription Needed!!
                    </Text>
                  </View>
                }
              >
                <Image
                  source={require('../assets/pharmacy.png')}
                  style={{ height: 50, width: 50 }}
                />
              </Popable>
            )}
          </View>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              height: 100,
              marginTop: 15,
              paddingHorizontal: 15,
            }}>
            <BigButton
              loading={addingToCart}
              onPress={() => {
                setAddingToCart(true);
                setTimeout(() => {
                  addToCart(cartItem);
                  showMessage({
                    message: `${quantity} ${item.name} added to Cart`,
                    type: 'success',
                  });
                  setAddingToCart(false);
                }, 1000);
              }}
              text={`₹${item.price}`}
              subtitle="Add To Cart"
              buttonStyle={{
                width: 250,
                marginStart: 20,
                marginVertical: 20
              }}
              titleStyle={{
                fontSize: 25
              }}
            />

            <QuantitySelector
              onIncrease={onIncrease}
              onDecrease={onDecrease}
              quantity={quantity}
            />
          </View>
        </View>
        <View style={styles.desc}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={{ ...styles.salt, fontWeight: 'bold' }}>
              Introduction
            </Text>
            <MaterialIcons
              name="keyboard-arrow-down"
              size={22}
              color="#FFF"
              onPress={() => setIntroCollapsed(prev => !prev)}
            />
          </View>
          {introCollapsed && (
            <Text style={styles.sectionDescription}>
              {item.description.introduction}
            </Text>
          )}
        </View>
        <View style={styles.desc}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={{ ...styles.salt, fontWeight: 'bold' }}>Uses</Text>
            <MaterialIcons
              name="keyboard-arrow-down"
              size={22}
              color="#FFF"
              onPress={() => setUsesCollapsed(prev => !prev)}
            />
          </View>
          {usesCollapsed &&
            item.description.uses.map(itemData => (
              <Text key={itemData} style={styles.sectionDescription}>
                {`\u2022 ${itemData}`}
              </Text>
            ))}
        </View>
        <View style={styles.desc}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={{ ...styles.salt, fontWeight: 'bold' }}>
              Side Effects
            </Text>
            <MaterialIcons
              name="keyboard-arrow-down"
              size={22}
              color="#FFF"
              onPress={() => setSideEffectsCollapsed(prev => !prev)}
            />
          </View>
          {sideEffectsCollapsed &&
            item.description.side_effects.map(itemData => (
              <Text key={itemData} style={styles.sectionDescription}>
                {`\u2022 ${itemData}`}
              </Text>
            ))}
        </View>
        {/* <View style={styles.desc}> */}
        {/* {data && data.findDrugForSameSalt.drugs && (
                    <View style={{ marginVertical: 15 }}>
                      <Text style={{ ...styles.salt, fontWeight: "bold", marginStart: 25 }}>
                        Alternate Brands
                      </Text>
                      <FlatList
                        showsHorizontalScrollIndicator={false}
                        horizontal={true}
                        data={data.findDrugForSameSalt.drugs}
                        renderItem={(itemData) => {
                          return <Card name={itemData.item.name} />;
                        }}
                      />
                    </View>
                  )} */}
        {/* </View> */}
        <View style={styles.desc}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text
              style={{ ...styles.salt, ...{ fontWeight: 'bold', fontSize: 17 } }}>
              How to cope with side effects
            </Text>
            <MaterialIcons
              name="keyboard-arrow-down"
              size={22}
              color="#FFF"
              onPress={() => setHowToSECollapsed(prev => !prev)}
            />
          </View>

          {howToSECollpased &&
            item.description.how_to_cope_with_side_effects.map(itemData => (
              <View style={{ marginBottom: 20 }} key={itemData.question}>
                <Text
                  style={{
                    ...styles.sectionDescription,
                    ...{ fontSize: 15, fontWeight: 'bold' },
                  }}>
                  {`\u2022 ${itemData.question}`}
                </Text>
                <Text style={styles.sectionDescription}>{itemData.answer}</Text>
              </View>
            ))}
        </View>
        <View style={styles.desc}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text
              style={{ ...styles.salt, ...{ fontWeight: 'bold', fontSize: 17 } }}>
              How to Use
            </Text>
            <MaterialIcons
              name="keyboard-arrow-down"
              size={22}
              color="#FFF"
              onPress={() => setHowToUseCollapsed(prev => !prev)}
            />
          </View>
          {howToUseCollapsed && (
            <Text style={styles.sectionDescription}>
              {item.description.how_to_use}
            </Text>
          )}
        </View>
        <View style={{ ...styles.desc, marginBottom: 40 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={{ ...styles.salt, fontWeight: 'bold' }}>
              Safety Advice
            </Text>
            <MaterialIcons
              name="keyboard-arrow-down"
              size={22}
              color="#FFF"
              onPress={() => setSafetyAdviceCollapsed(prev => !prev)}
            />
          </View>
          {safetyAdviceCollapsed &&
            item.description.safety_advice.map(itemData => (
              <View style={{ marginBottom: 20 }} key={itemData.question}>
                <Text
                  style={{
                    ...styles.sectionDescription,
                    ...{ fontSize: 15, fontWeight: 'bold' },
                  }}>
                  {`\u2022 ${itemData.question}`}
                </Text>
                <Text style={styles.sectionDescription}>
                  {' '}
                  {itemData.answer}{' '}
                </Text>
              </View>
            ))}
        </View>
      </View>
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.PRIMARY,
  },
  content: {
    alignItems: 'center',
    marginTop: 5,
    flexDirection: 'column',
  },
  imageContainer: {
    width: '100%',
    height: 400,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bigTitle: {
    fontSize: 50,
    fontWeight: '600',
    color: '#fff',
  },
  salt: {
    fontSize: 15,
    color: '#FFF',
    fontWeight: 'normal',
  },
  row: {
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginHorizontal: 10,
    alignItems: 'center',
    paddingHorizontal: 25,
    marginTop: 10,
  },
  buyBtn: {
    width: 250,
    height: 85,
    backgroundColor: colors.SECONDARY,
    flexDirection: 'column',
    justifyContent: 'space-around',

    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 15,
    marginStart: 10,
    color: '#fff',
  },
  desc: {
    justifyContent: 'flex-start',
    paddingHorizontal: 25,
    marginVertical: 20,
    color: '#fff',
  },
  sectionDescription: {
    color: '#fff',
    marginTop: 5,
  },
});
export default DrugDetailScreen;
