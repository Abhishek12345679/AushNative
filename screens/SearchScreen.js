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
  StatusBar,
  Dimensions,
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
            margin: 10,
          }}>
          <TextInput
            onSubmitEditing={() => {
              getMedicine({variables: {name: searchText}});
            }}
            returnKeyType="search"
            placeholder="search here"
            placeholderTextColor="#fff"
            value={searchText}
            onChangeText={text => {
              setSearchText(text);
            }}
            style={{
              width: '100%',
              height: 65,
              fontSize: 16,
              color: '#fff',
              backgroundColor: colors.PRIMARY,
              padding: 10,
              marginTop: StatusBar.currentHeight,
              borderRadius: 20,
              textAlignVertical: 'center',
              textAlign: 'center',
            }}
          />
        </View>
        {!!data && !loading ? (
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
        ) : !data && loading ? (
          <View
            style={{
              flex: 1,
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              height:
                Dimensions.get('window').height - StatusBar.currentHeight - 100,
            }}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
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
            <Text style={{color: '#fff', fontSize: 20, fontWeight: 'normal'}}>
              No medicines
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
