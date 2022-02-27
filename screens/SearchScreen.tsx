import React, { useState } from 'react';
import {
  ActivityIndicator,
  Text,
  View,
  FlatList,
} from 'react-native';
import { colors } from '../constants/colors';
import { gql, useLazyQuery } from '@apollo/client';
import ListItem from '../components/ListItem';
import { observer } from 'mobx-react';
import SearchBar from '../components/SearchBar';

const SearchScreen = observer(({ navigation }) => {
  const [searchText, setSearchText] = useState<string>('');
  const GET_MEDICINE = gql`
    query getMedicine($name: String!, $pageSize: Int!) {
      search(name: $name, pageSize: $pageSize) {
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
        totalItems
        hasMore
      }
    }
  `;
  const [getMedicine, { loading, data, error }] = useLazyQuery(GET_MEDICINE);


  if (loading) {
    return (
      <>
        <SearchBar
          navigation={navigation}
          onChangeText={setSearchText}
          onSubmitEditing={() => {
            getMedicine({ variables: { name: searchText } });
          }}
          searchText={searchText}
        />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator color="#FFF" size="large" />
        </View>
      </>
    );
  }

  if (error) {
    return (
      <>
        <SearchBar
          navigation={navigation}
          onChangeText={setSearchText}
          onSubmitEditing={() => {
            getMedicine({ variables: { name: searchText } });
          }}
          searchText={searchText}
        />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>{error.name}</Text>
          <Text>{error.message}</Text>
        </View>
      </>
    );
  }

  return (
    <>
      {data ?
        <FlatList
          keyExtractor={item => item.id}
          data={data ? data.search.drugs : []}
          ListHeaderComponent={() =>
            <SearchBar
              navigation={navigation}
              onChangeText={setSearchText}
              onSubmitEditing={() => {
                getMedicine({ variables: { name: searchText } });
              }}
              searchText={searchText}
            />
          }
          renderItem={({ item, index }) => (
            <ListItem
              keyProp={index}
              title={item.name}
              subtitle={`${item.salt.length >= 20 ? item.salt.substring(0, 20) + "..." : item.salt}`}
              imageUrl={item.image_url}
              onPress={() =>
                navigation.navigate('Drug', {
                  item: item,
                })
              }
              style={{
                backgroundColor: colors.PRIMARY,
                borderBottomWidth: 0,
                marginHorizontal: 10,
              }}
              titleStyle={{ color: '#fff' }}
            />
          )}
        /> :
        <>
          <SearchBar
            navigation={navigation}
            onChangeText={setSearchText}
            onSubmitEditing={() => {
              getMedicine({ variables: { name: searchText } });
            }}
            searchText={searchText}
          />
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: '#fff', fontSize: 15, fontWeight: '500' }}>Try Searching for another medicine!</Text>
          </View>
        </>
      }
    </>
  );
});

export default SearchScreen;
