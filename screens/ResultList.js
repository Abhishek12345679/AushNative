import React, {useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  StatusBar,
  StyleSheet,
  Button,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from 'react-native';

import ListItem from '../components/ListItem';
import {gql, useQuery} from '@apollo/client';
import DrugStore from '../store/CartStore';
import {observer} from 'mobx-react';

import {Entypo} from '@expo/vector-icons';
import {colors} from '../constants/colors';

const GET_MEDICINE = gql`
  query getMedicine($name: String!) {
    search(name: $name) {
      drugs {
        id
        name
        image_url
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

const GET_ALTERNATE_DRUG = gql`
  query getAlternateDrug($salt: String!) {
    findDrugForSameSalt(salt: $salt) {
      drugs {
        id
        name
        image_url
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

const ResultList = observer(props => {
  let ocr_data = '';
  const mode = props.route.params.mode;

  if (props.route.params.manual_search) {
    ocr_data = props.route.params.query;
  } else {
    ocr_data = props.route.params.data;
  }

  if (mode === 'name' || mode === 'scan') {
    var {loading, data, error} = useQuery(GET_MEDICINE, {
      variables: {name: ocr_data.toLowerCase()},
    });
  } else if (mode === 'salt') {
    var {loading, data, error} = useQuery(GET_ALTERNATE_DRUG, {
      variables: {salt: ocr_data.toLowerCase()},
    });
  }

  useEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <Pressable
          android_ripple={{
            color: '#fff',
            borderless: true,
          }}
          onPress={() => {
            props.navigation.navigate('Cart');
          }}
          style={{
            flexDirection: 'row',
          }}>
          <Entypo name="shopping-cart" color="#fff" size={24} />
          <Text style={{color: '#FFFFFF'}}>{DrugStore.count}</Text>
        </Pressable>
      ),
      headerLargeTitle: false,
    });
  }, []);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.PRIMARY,
        }}>
        <ActivityIndicator color="#FFF" size="large" />
      </View>
    );
  }

  if (error) {
    console.error(error);
    return;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.SECONDARY} />
      {data ? (
        (
          mode === 'name' || mode === 'scan'
            ? data.search.items > 0
            : data.findDrugForSameSalt.items > 0
        ) ? (
          <FlatList
            ListHeaderComponent={
              <View style={{marginVertical: 10, marginStart: 5}}>
                <Text style={{fontSize: 15, fontWeight: 'bold', color: '#fff'}}>
                  {mode === 'name' || mode === 'scan'
                    ? data.search.items
                    : data.findDrugForSameSalt.items}{' '}
                  Meds found
                </Text>
              </View>
            }
            data={
              mode === 'name' || mode === 'scan'
                ? data.search.drugs
                : data.findDrugForSameSalt.drugs
            }
            renderItem={itemData => {
              return (
                <ListItem
                  style={{
                    backgroundColor: colors.PRIMARY,
                  }}
                  name={itemData.item.name}
                  salt_composition={`${itemData.item.salt.substring(0, 20)}...`}
                  imageUrl={itemData.item.image_url}
                  onPress={() =>
                    props.navigation.navigate('Drug', {
                      item: itemData.item,
                    })
                  }
                />
              );
            }}
          />
        ) : (
          <ScrollView style={styles.container}>
            <Text style={{color: '#000', fontWeight: '400'}}>
              No Drugs Found in Chemy's Database, enter the drug as accuarate as
              possible in the search bar below
            </Text>

            <Button
              title="return"
              onPress={() => {
                props.navigation.pop();
              }}
            />
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                marginVertical: 50,
              }}>
              <Text>No Medicines</Text>
            </View>
          </ScrollView>
        )
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: 50,
          }}>
          <Text>No Medicines</Text>
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.PRIMARY,
    padding: 10,
  },
});

export default ResultList;
