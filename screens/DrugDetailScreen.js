import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Pressable,
} from 'react-native';

import {showMessage} from 'react-native-flash-message';

import QuantitySelector from '../components/QuantitySelector';
import {observer} from 'mobx-react';
import {MaterialIcons, Entypo} from '@expo/vector-icons';
import DrugStore from '../store/CartStore';
import {colors} from '../constants/colors';

const DrugDetailScreen = observer(props => {
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

  const [cartItem, setCartItem] = useState({
    name: '',
    salt: '',
    price: 0,
    quantity: 0,
    prescription_req: false,
    total_amt: 0,
  });

  const addToCart = () => {
    DrugStore.addDrug(cartItem);
    setCartCount(cartCount + 1);
  };

  const item = props.route.params.item;

  console.log(item.imageUrl);

  useEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <Pressable
          android_ripple={{
            color: '#fff',
            borderless: false,
          }}
          style={{flexDirection: 'row'}}
          onPress={() => {
            props.navigation.navigate('Cart');
          }}>
          <Entypo name="shopping-cart" color="#fff" size={20} />

          <Text style={{color: '#FFF', fontSize: 15}}>{DrugStore.count}</Text>
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
      <View style={{flex: 1}}>
        <StatusBar barStyle="light-content" backgroundColor={colors.PRIMARY} />
        <View style={{marginStart: 15, marginTop: 15}}>
          <Text style={{color: '#FFF', fontSize: 15, fontWeight: 'bold'}}>
            Manufacturer
          </Text>
          <Text style={{color: '#fff'}}>{item.manufacturer_name}</Text>
        </View>
        <View style={styles.content}>
          <View style={styles.imageContainer}>
            <Image
              source={{
                uri: item.image_url,
              }}
              style={{
                height: 380,
                width: 380,
                backgroundColor: colors.PRIMARY,
                borderRadius: 20,
              }}
            />
          </View>
          <View style={styles.row}>
            <View style={{width: '70%'}}>
              <Text style={{color: '#FFF', fontWeight: 'bold'}}>Salt</Text>
              <Text style={styles.salt}>{item.salt}</Text>
            </View>
            {item.requires_prescription && (
              <Image
                source={require('../assets/pharmacy.png')}
                style={{height: 50, width: 50}}
              />
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
            <TouchableOpacity
              style={styles.buyBtn}
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
              }}>
              {!addingToCart ? (
                <View
                  style={{
                    alignItems: 'center',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}>
                  <View>
                    <Text
                      style={{
                        fontSize: 35,
                        fontWeight: 'bold',
                        color: '#ffffff',
                      }}>
                      ₹{item.price}
                    </Text>
                  </View>
                  <Text style={{fontSize: 15, color: '#fff'}}>Add to cart</Text>
                </View>
              ) : (
                <ActivityIndicator size="large" color="#FFF" />
              )}
            </TouchableOpacity>
            <QuantitySelector
              onIncrease={onIncrease}
              onDecrease={onDecrease}
              quantity={quantity}
            />
          </View>
          {/* <View
            style={{
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 20,
              paddingVertical: 10,
            }}>
            <TextInput
              placeholder="Enter Pincode"
              value={pincode}
              onChangeText={pin => setPincode(pin)}
              style={{
                height: 50,
                width: '70%',
                borderColor: '#000',
                borderWidth: 1,
                padding: 10,
              }}
              keyboardType="number-pad"
              maxLength={6}
            />
            <Pressable
              style={{
                width: '20%',
                justifyContent: 'center',
                alignItems: 'center',
                height: 50,
                backgroundColor: '#000',
              }}
              android_ripple={{
                color: '#FFF',
                borderless: true,
              }}
              onPress={fetchPlaceFromPincode}>
              <Text style={{color: '#fff'}}>Check</Text>
            </Pressable>
          </View> */}
        </View>
        <View style={styles.desc}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={{...styles.salt, fontWeight: 'bold'}}>
              Introduction
            </Text>
            <MaterialIcons
              name="keyboard-arrow-down"
              size={22}
              color="#000"
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
            <Text style={{...styles.salt, fontWeight: 'bold'}}>Uses</Text>
            <MaterialIcons
              name="keyboard-arrow-down"
              size={22}
              color="#000"
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
            <Text style={{...styles.salt, fontWeight: 'bold'}}>
              Side Effects
            </Text>
            <MaterialIcons
              name="keyboard-arrow-down"
              size={22}
              color="#000"
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
              style={{...styles.salt, ...{fontWeight: 'bold', fontSize: 17}}}>
              How to cope with side effects
            </Text>
            <MaterialIcons
              name="keyboard-arrow-down"
              size={22}
              color="#000"
              onPress={() => setHowToSECollapsed(prev => !prev)}
            />
          </View>

          {howToSECollpased &&
            item.description.how_to_cope_with_side_effects.map(itemData => (
              <View style={{marginBottom: 20}} key={itemData.question}>
                <Text
                  style={{
                    ...styles.sectionDescription,
                    ...{fontSize: 15, fontWeight: 'bold'},
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
              style={{...styles.salt, ...{fontWeight: 'bold', fontSize: 17}}}>
              How to Use
            </Text>
            <MaterialIcons
              name="keyboard-arrow-down"
              size={22}
              color="#000"
              onPress={() => setHowToUseCollapsed(prev => !prev)}
            />
          </View>
          {howToUseCollapsed && (
            <Text style={styles.sectionDescription}>
              {item.description.how_to_use}
            </Text>
          )}
        </View>
        <View style={{...styles.desc, marginBottom: 40}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={{...styles.salt, fontWeight: 'bold'}}>
              Safety Advice
            </Text>
            <MaterialIcons
              name="keyboard-arrow-down"
              size={22}
              color="#000"
              onPress={() => setSafetyAdviceCollapsed(prev => !prev)}
            />
          </View>
          {safetyAdviceCollapsed &&
            item.description.safety_advice.map(itemData => (
              <View style={{marginBottom: 20}} key={itemData.question}>
                <Text
                  style={{
                    ...styles.sectionDescription,
                    ...{fontSize: 15, fontWeight: 'bold'},
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
