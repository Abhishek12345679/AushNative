import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StatusBar,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from 'react-native';

import ListItem from '../components/ListItem';
import { gql, useQuery } from '@apollo/client';
import DrugStore from '../store/CartStore';
import { observer } from 'mobx-react';

import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';

export const GET_MEDICINE = gql`
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

export const GET_ALTERNATE_DRUG = gql`
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

const ResultList = observer((props: any) => {
  let ocr_data = '';
  const mode = props.route.params.mode;

  if (props.route.params.manual_search) {
    ocr_data = props.route.params.query;
  } else {
    ocr_data = props.route.params.data;
  }

  if (mode === 'name' || mode === 'scan') {
    var { loading, data, error } = useQuery(GET_MEDICINE, {
      variables: { name: ocr_data.toLowerCase() },
    });
  } else if (mode === 'salt') {
    var { loading, data, error } = useQuery(GET_ALTERNATE_DRUG, {
      variables: { salt: ocr_data.toLowerCase() },
    });
  }

  console.log(data)

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
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.PRIMARY,
        }}>
        <Text
          style={{
            color: "#fff"
          }}
        >
          {error.name}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.SECONDARY} />
      {!!data ? <FlatList
        ListHeaderComponent={
          <View style={{ marginVertical: 10, marginStart: 5 }}>
            <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#fff' }}>
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
        renderItem={({ item, index }) => {
          return (
            <ListItem
              keyProp={index}
              style={{
                backgroundColor: colors.PRIMARY,
              }}
              title={item.name}
              subtitle={`${item.salt.substring(0, 20)}...`}
              imageUrl={item.image_url}
              onPress={() =>
                props.navigation.navigate('Drug', {
                  item: item,
                })
              }
            />
          );
        }}
      /> :
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.PRIMARY,
          }}
        >
          <Text style={{ color: "#fff" }}>Heelo</Text>
        </View>
      }
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
