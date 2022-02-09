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

  const [pincode, setPincode] = useState('');

  //workaround
  const [cartCount, setCartCount] = useState(0);

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
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate('Cart');
          }}>
          <Entypo name="shopping-cart" color="#fff" size={24} />

          <Text style={{color: '#000'}}>{DrugStore.count}</Text>
        </TouchableOpacity>
      ),
      headerTitle: item ? item.name : 'Drug',
    });
  }, [cartCount]);

  useEffect(() => {
    setCartItem({
      id: item.id,
      name: item.name,
      salt: item.salt,
      price: parseFloat(parseFloat(item.price).toFixed(2)),
      quantity: parseInt(quantity),
      prescription_req: item.requires_prescription,
      total_amt:
        parseInt(quantity) * parseFloat(parseFloat(item.price).toFixed(2)),
    });
  }, [item, quantity]);

  const fetchPlaceFromPincode = async () => {
    const response = await fetch(
      `https://api.postalpincode.in/pincode/${pincode}`,
    );
    const resData = await response.json();

    console.log(resData);
    console.log(resData[0].Status);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={{flex: 1}}>
        {Platform.OS === 'ios' && (
          <StatusBar barStyle="dark-content" backgroundColor="#000" />
        )}
        <View style={{marginStart: 15, marginTop: 15}}>
          <Text style={{color: '#0000FF'}}> Manufacturer </Text>
          <Text> {item.manufacturer_name} </Text>
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
              }}
            />
          </View>
          <View style={styles.row}>
            <View style={{width: '70%'}}>
              <Text style={{color: '#0000FF'}}>Salt</Text>
              <Text style={styles.salt}>{item.salt}</Text>
            </View>
            {item.requires_prescription && (
              <TouchableOpacity
                style={{height: 50, width: 50}}
                onPress={() => setToolTipVisible(true)}>
                <Image
                  source={require('../assets/pharmacy.png')}
                  style={{height: 50, width: 50}}
                />
              </TouchableOpacity>
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
          <View
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
          </View>
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
            <Text style={{marginTop: 5}}>{item.description.introduction}</Text>
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
              <Text key={itemData} style={{marginTop: 5}}>
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
              <Text key={itemData} style={{marginTop: 5}}>
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
            <Text style={{...styles.salt, fontWeight: 'bold'}}>
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
                <Text style={{marginTop: 5, fontSize: 20}}>
                  {`\u2022 ${itemData.question}`}
                </Text>
                <Text style={{marginTop: 5}}> {itemData.answer} </Text>
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
            <Text style={{...styles.salt, fontWeight: 'bold'}}>How to Use</Text>
            <MaterialIcons
              name="keyboard-arrow-down"
              size={22}
              color="#000"
              onPress={() => setHowToUseCollapsed(prev => !prev)}
            />
          </View>
          {howToUseCollapsed && (
            <Text style={{marginTop: 5}}>{item.description.how_to_use}</Text>
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
                <Text style={{marginTop: 5, fontSize: 20}}>
                  {`\u2022 ${itemData.question}`}
                </Text>
                <Text style={{marginTop: 5}}> {itemData.answer} </Text>
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
    backgroundColor: '#fff',
  },
  content: {
    alignItems: 'center',
    marginTop: 5,
    flexDirection: 'column',
  },
  imageContainer: {
    width: '100%',
    // backgroundColor: '#000',
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
    fontSize: 20,
    fontWeight: '400',
    color: '#000',
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
  },
  desc: {
    justifyContent: 'flex-start',
    paddingHorizontal: 25,
    marginTop: 10,
  },
});
export default DrugDetailScreen;
