import React, {useState} from 'react';
import {
  ActivityIndicator,
  Text,
  TextInput,
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Platform,
} from 'react-native';
import {colors} from '../constants/colors';
import {gql, useLazyQuery} from '@apollo/client';
import ListItem from '../components/ListItem';
import {observer} from 'mobx-react';

const SearchScreen = observer(({navigation}) => {
  const [searchText, setSearchText] = useState('');

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

  const [getMedicine, {loading, data, error}] = useLazyQuery(GET_MEDICINE);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <TextInput
            onSubmitEditing={() => {
              getMedicine({variables: {name: searchText}});
            }}
            returnKeyType="search"
            placeholder="search here"
            placeholderTextColor="#ccc"
            value={searchText}
            onChangeText={text => {
              setSearchText(text);
            }}
            style={{
              width: '100%',
              height: Platform.OS === 'ios' ? 30 : 100,
              fontSize: 16,
              color: '#fff',
              backgroundColor: '#00000025',
              // alignItems: 'center',
            }}
            textAlign="center"
          />
        </View>
        {!!data ? (
          data.search.drugs.map((med, index) => (
            <ListItem
              keyProp={index}
              key={index}
              saltTextStyle={{color: '#ccc'}}
              style={{
                backgroundColor: colors.SECONDARY,
                borderBottomWidth: 0,
              }}
              titleStyle={{color: '#fff'}}
              name={med.name}
              salt_composition={`${med.salt.substring(0, 20)}...`}
              imageUrl={med.image_url}
              onPress={() =>
                navigation.navigate('Drug', {
                  item: med,
                })
              }
            />
          ))
        ) : loading ? (
          <ActivityIndicator color="#fff" size="large" />
        ) : (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: '#fff',
                fontSize: 20,
              }}>
              No medicine
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
});

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.SECONDARY,
  },
  text: {
    color: '#fff',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
