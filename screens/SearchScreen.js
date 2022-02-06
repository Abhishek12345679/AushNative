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
// import {HeaderBackButton} from '@react-navigation/stack';
import {gql, useLazyQuery} from '@apollo/client';
import ListItem from '../components/ListItem';
import {observer} from 'mobx-react';
import {ScreenStackHeaderBackButtonImage} from 'react-native-screens';

const SearchScreen = observer(({navigation}) => {
  const GET_MEDICINE = gql`
    query getMedicine($name: String!) {
      search(name: $name) {
        drugs {
          id
          name
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

  const [searchText, setSearchText] = useState('');

  const [getMedicine, {loading, data, error}] = useLazyQuery(GET_MEDICINE);

  return (
    <ScrollView style={styles.container}>
      <SafeAreaView>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <ScreenStackHeaderBackButtonImage
            tintColor="#fff"
            pressColorAndroid="#fff"
            labelVisible={false}
            onPress={() => {
              navigation.goBack();
            }}
          />
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
              width: '70%',
              height: Platform.OS === 'ios' ? 30 : 50,
              fontSize: 16,
              color: '#fff',
            }}
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
              imageUrl={med.imageUrl}
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
      </SafeAreaView>
    </ScrollView>
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
