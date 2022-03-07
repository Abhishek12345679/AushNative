import React, { useState, useEffect, useReducer } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  Image,
  ActivityIndicator,
} from 'react-native';

import { showMessage } from 'react-native-flash-message';
import QuantitySelector from '../components/QuantitySelector';
import { observer } from 'mobx-react';
import { MaterialIcons } from '@expo/vector-icons';
import DrugStore, { DrugType } from '../store/CartStore';
import { colors } from '../constants/colors';
import { Popable } from 'react-native-popable';
import BigButton from '../components/BigButton'
import IconWithBadge from '../components/IconWithBadge';
import DrugDetailsSection from '../components/DrugDetailsSection';
import { useQuery } from '@apollo/client';
import { GET_DRUG } from '../helpers/queries';

const ACTIONS = {
  TOGGLE_SECTION: "TOGGLE_SECTION"
}

const drugDataReducer = (state: any, action: any) => {
  switch (action.type) {
    case ACTIONS.TOGGLE_SECTION:
      console.log(toggleSection(state, action.payload.key))
      return { ...state, ...toggleSection(state, action.payload.key) }
    default:
      return state
  }
}

const toggleSection = (state: any, key: string) => {
  return {
    [key]: !(state[key])
  }
}

const DrugDetailScreen = observer((props: any) => {
  const { drugId } = props.route.params;

  var { loading, data, error } = useQuery(GET_DRUG, {
    variables: { id: drugId },
  });

  const [addingToCart, setAddingToCart] = useState(false);
  const [cartCount, setCartCount] = useState(DrugStore.count);

  const [drugDataState, drugDataDispatch] = useReducer(drugDataReducer, {
    introduction: true,
    uses: true,
    sideEffects: false,
    howToSE: false,
    howToUse: false,
    safetyAdvice: true
  });

  // quantity selector
  const [quantity, setQuantity] = useState(1);

  const onIncrease = () => {
    setQuantity((qty) => qty + 1);
  };

  const onDecrease = () => {
    if (quantity >= 2) {
      setQuantity((qty) => qty - 1);
    }
  };


  const addToCart = (item: DrugType) => {
    DrugStore.addDrug({
      id: item.id,
      image_url: item.image_url,
      name: item.name,
      salt: item.salt,
      price: parseFloat((item.price).toFixed(2)),
      quantity: quantity,
      prescription_req: item.prescription_req,
      total_amt:
        quantity * parseFloat(item.price.toFixed(2)),
    });
    setCartCount(cartCount + quantity);
  };

  useEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <IconWithBadge
          iconColor='#FFF'
          iconName='cart'
          iconSize={24}
          value={cartCount}
          badgeColor="red"
          onPress={() => props.navigation.navigate("Cart")}
        />
      ),
      headerTitle: data ? data.getDrug.name : 'Drug',
      headerStyle: {
        backgroundColor: colors.PRIMARY,
      },
      headerTintColor: '#fff',
    });
  }, [cartCount]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color="#FFF" size="large" />
      </View>
    )
  }

  if (error) {
    <View style={styles.centered}>
      <Text style={{ color: '#fff' }}>{error.name}</Text>
      <Text style={{ color: '#fff' }}>{error.message}</Text>
    </View>
  }

  if (data) {
    // console.log(data.getDrug.description)
    const drugData = data.getDrug
    return (
      // <></>
      <ScrollView style={styles.container}>
        <View style={{ flex: 1 }}>
          <StatusBar barStyle="light-content" backgroundColor={colors.PRIMARY} />
          <View style={{ marginStart: 15, marginTop: 15 }}>
            <Text style={{ color: '#FFF', fontSize: 15, fontWeight: 'bold' }}>
              Manufacturer
            </Text>
            <Text style={{ color: '#fff' }}>{drugData.manufacturer_name}</Text>
          </View>
          <View style={styles.content}>
            <View style={styles.imageContainer}>
              <Image
                source={{
                  uri: drugData.image_url,
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
                <Text style={styles.salt}>{drugData.salt}</Text>
              </View>
              {drugData.requires_prescription && (
                <Popable
                  animated={true}
                  animationType="spring"
                  action="press"
                  caret={true}
                  strictPosition={true}
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
                        backgroundColor: colors.SECONDARY,
                      }}
                    >
                      <Text style={{ color: "#FFF", fontWeight: "bold" }}>
                        Prescription Needed!!
                      </Text>
                    </View>
                  }
                >
                  <MaterialIcons
                    name="local-pharmacy"
                    size={40}
                    color="#fff"
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
                    addToCart(drugData);
                    showMessage({
                      message: `${quantity} ${drugData.name} added to Cart`,
                      type: 'success',
                    });
                    setAddingToCart(false);
                  }, 200);
                }}
                text={`₹${drugData.price}`}
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
                quantity={quantity.toString()}
              />
            </View>
          </View>

          <DrugDetailsSection
            label="Introduction"
            onPress={() => drugDataDispatch({
              type: ACTIONS.TOGGLE_SECTION,
              payload: {
                key: "introduction"
              }
            })}
          >
            {drugDataState.introduction && (
              <Text style={styles.sectionDescription}>
                {drugData.description.introduction}
              </Text>
            )}
          </DrugDetailsSection>

          <DrugDetailsSection
            label="Uses"
            onPress={() => drugDataDispatch({
              type: ACTIONS.TOGGLE_SECTION,
              payload: {
                key: "uses"
              }
            })}
          >
            {drugDataState.uses &&
              drugData
                .description
                .uses
                .map((itemData: any, _index: number) => (
                  <Text key={itemData} style={styles.sectionDescription}>
                    {`\u2022 ${itemData}`}
                  </Text>
                ))}
          </DrugDetailsSection>

          <DrugDetailsSection
            label="Side Effects"
            onPress={() => drugDataDispatch({
              type: ACTIONS.TOGGLE_SECTION,
              payload: {
                key: "sideEffects"
              }
            })}
          >
            {drugDataState.sideEffects &&
              drugData
                .description
                .side_effects
                .map((itemData: any, _index: number) => (
                  <Text key={itemData} style={styles.sectionDescription}>
                    {`\u2022 ${itemData}`}
                  </Text>
                ))}
          </DrugDetailsSection>
          <DrugDetailsSection
            label="How to cope with side effects"
            onPress={() => drugDataDispatch({
              type: ACTIONS.TOGGLE_SECTION,
              payload: {
                key: "howToSE"
              }
            })}
          >
            {drugDataState.howToSE &&
              drugData
                .description
                .how_to_cope_with_side_effects
                .map((itemData: any, _index: number) => (
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
          </DrugDetailsSection>
          <DrugDetailsSection
            label="How to Use"
            onPress={() => drugDataDispatch({
              type: ACTIONS.TOGGLE_SECTION,
              payload: {
                key: "howToUse"
              }
            })}
          >
            {drugDataState.howToUse && (
              <Text style={styles.sectionDescription}>
                {drugData.description.how_to_use}
              </Text>
            )}
          </DrugDetailsSection>

          <DrugDetailsSection
            label="Safety Advice"
            onPress={() => drugDataDispatch({
              type: ACTIONS.TOGGLE_SECTION,
              payload: {
                key: "safetyAdvice"
              }
            })}
          >
            {drugDataState.safetyAdvice &&
              drugData
                .description
                .safety_advice
                .map((itemData: any, _index: number) => (
                  <View style={{ marginBottom: 20 }} key={itemData.question}>
                    <Text
                      style={{
                        ...styles.sectionDescription,
                        ...{ fontSize: 15, fontWeight: 'bold' },
                      }}>
                      {`\u2022 ${itemData.question}`}
                    </Text>
                    <Text style={styles.sectionDescription}>
                      {itemData.answer}
                    </Text>
                  </View>
                ))}
          </DrugDetailsSection>
        </View>
      </ScrollView>
    );
  }

});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.PRIMARY,
  },
  centered: {
    flex: 1,
    backgroundColor: colors.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center'
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
  sectionDescription: {
    color: '#fff',
    marginTop: 5,
  },
});

export default DrugDetailScreen;
