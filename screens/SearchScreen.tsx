import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Text,
  View,
  FlatList,
  SafeAreaView,
  Pressable,
} from 'react-native';

import { colors } from '../constants/colors';
import { gql, useLazyQuery } from '@apollo/client';
import ListItem from '../components/ListItem';
import { observer } from 'mobx-react';
import SearchBar from '../components/SearchBar';
import DrugStore from '../store/CartStore';
import { AntDesign } from '@expo/vector-icons'

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
      <SafeAreaView style={{ flex: 1 }}>
        <SearchBar
          navigation={navigation}
          onChangeText={(text) => setSearchText(text)}
          onSubmitEditing={() => {
            getMedicine({ variables: { name: searchText, pageSize: 10 } });
          }}
          searchText={searchText}
        />
        <View style={{ height: "90%", justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator color="#FFF" size="large" />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <SearchBar
          navigation={navigation}
          onChangeText={(text) => setSearchText(text)}
          onSubmitEditing={async () => {
            await getMedicine({ variables: { name: searchText, pageSize: 10 } });
          }}
          searchText={searchText}
        />
        <View style={{ height: "90%", justifyContent: 'center', alignItems: 'center' }}>
          <Text>{error.name}</Text>
          <Text>{error.message}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (data) {
    if (data.search.drugs.length > 0) {
      DrugStore.addToPrevSearches(searchText)
    }
  }


  return (
    <SafeAreaView style={{ flex: 1 }}>
      {!!data ?
        <FlatList
          keyExtractor={item => item.id}
          data={data ? data.search.drugs : []}
          ListHeaderComponent={
            <SearchBar
              navigation={navigation}
              onChangeText={(text) => setSearchText(text)}
              onSubmitEditing={async () => {
                await getMedicine({ variables: { name: searchText, pageSize: 10 } });
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
                  drugId: item.id,
                })
              }
              style={{
                backgroundColor: colors.PRIMARY,
                borderBottomWidth: 0,
                marginHorizontal: 20,
                marginBottom: 10,
                width: '95%',
              }}
              titleStyle={{ color: '#fff' }}
            />
          )}
        /> :
        <SafeAreaView style={{ flex: 1 }}>
          <SearchBar
            navigation={navigation}
            onChangeText={(text) => setSearchText(text)}
            onSubmitEditing={async () => {
              await getMedicine({ variables: { name: searchText, pageSize: 10 } });
            }}
            searchText={searchText}
          />
          {DrugStore.prevSearches.length > 0 ?
            <View
              style={{
                marginHorizontal: 20,
              }}
            >
              <Text style={{ color: "#fff", fontSize: 15, fontWeight: 'bold', marginBottom: 10 }}>
                Previous Searches
              </Text>
              {
                DrugStore.prevSearches.map((searchQ, index) => (
                  <Pressable
                    key={index}
                    android_ripple={{
                      color: "#fff",
                      borderless: false
                    }}
                    style={{
                      height: 40,
                      justifyContent: 'space-between',
                      marginStart: 5,
                      alignItems: 'center',
                      flexDirection: 'row'
                    }}
                    onPress={async () => {
                      await getMedicine({ variables: { name: searchQ, pageSize: 10 } });
                    }}
                  >
                    <Text style={{ color: '#fff' }}>{searchQ}</Text>
                    <AntDesign
                      style={{
                        transform: [{
                          rotate: '45deg'
                        }]
                      }}
                      name="arrowup"
                      color="#fff"
                      size={15}
                    />
                  </Pressable>
                ))
              }
            </View> :
            <View
              style={{
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Text style={{ color: "#fff" }}>Type something to search...</Text>
            </View>

          }
        </SafeAreaView>
      }
    </SafeAreaView>
  );
});

export default SearchScreen;
