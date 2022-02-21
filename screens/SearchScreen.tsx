import React, { useState } from 'react';
import {
  ActivityIndicator,
  Text,
  TextInput,
  View,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { colors } from '../constants/colors';
import { gql, useLazyQuery } from '@apollo/client';
import ListItem from '../components/ListItem';
import { observer } from 'mobx-react';
import { DrugType } from '../store/CartStore';
import RoundButton from '../components/RoundButton';
import { Ionicons } from '@expo/vector-icons'

const SearchScreen = observer(({ navigation }) => {
  const [searchText, setSearchText] = useState<string>('');
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
  const [getMedicine, { loading, data, error }] = useLazyQuery(GET_MEDICINE);

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
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          height:
            Dimensions.get('window').height - StatusBar.currentHeight - 100,
        }}>
        <Text
          style={{
            color: '#fff',
          }}>
          {error.name}
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.PRIMARY,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          margin: 10,
        }}>

        <View
          style={{
            width: '100%',
            height: 65,
            marginBottom: 30,
            flexDirection: 'row'
          }}
        >
          <RoundButton
            style={{
              marginTop: StatusBar.currentHeight,
              backgroundColor: "#ffffff00",
              elevation: 0
            }}
            onPress={() => {
              navigation.goBack()
            }}
          >
            <Ionicons name="arrow-back" color="#fff" size={26} />
          </RoundButton>
          <TextInput
            autoFocus
            onSubmitEditing={() => {
              getMedicine({ variables: { name: searchText } });
            }}
            returnKeyType="search"
            placeholder="search here"
            placeholderTextColor="#ccc"
            value={searchText}
            onChangeText={text => {
              setSearchText(text);
            }}
            style={{
              width: '85%',
              height: '80%',
              fontSize: 16,
              color: '#fff',
              backgroundColor: colors.SECONDARY,
              marginTop: StatusBar.currentHeight,
              paddingHorizontal: 20,
              borderRadius: 15,
            }}
            blurOnSubmit
          />
        </View>
      </View>
      <ScrollView>
        {!!data ? (
          data.search.drugs.map((med: DrugType, index: number) => (
            <ListItem
              keyProp={index}
              key={index}
              title={med.name}
              subtitle={`${med.salt.substring(0, 20)}...`}
              imageUrl={med.image_url}
              onPress={() =>
                navigation.navigate('Drug', {
                  item: med,
                })
              }
              style={{
                backgroundColor: colors.PRIMARY,
                borderBottomWidth: 0,
                marginHorizontal: 10,
              }}
              titleStyle={{ color: '#fff' }}
            />
          ))
        ) : (
          <View
            style={{
              flex: 1,
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              height:
                Dimensions.get('window').height - StatusBar.currentHeight - 100,
            }}>
            <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'normal' }}>
              Try searching for something else!!
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
});

export default SearchScreen;
