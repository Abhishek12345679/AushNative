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
import { gql, useLazyQuery } from '@apollo/client';
import DrugStore from '../store/CartStore';
import { observer } from 'mobx-react';

import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { GET_MEDICINE } from './ResultList';
import IconWithBadge from '../components/IconWithBadge';

export const GET_MEDICINE_COUNT = gql`
  query getMedicineCount($name: String!) {
    search(name: $name) {
      items
    }
  }
`;


const ScannedResultsScreen = observer((props: any) => {
    const words = props.route.params.words as Array<string>

    const [getMedicineCount, { loading: countLoading }] = useLazyQuery(GET_MEDICINE_COUNT);
    const [getMedicine, { loading, data, error }] = useLazyQuery(GET_MEDICINE);


    useEffect(() => {
        words
            .map((word) => word.toLowerCase())
            .filter((word) => word.length > 4)
            .map(async (word) => {
                // console.log("word: ", word)
                const { data } = await getMedicineCount({
                    variables: {
                        name: word
                    }
                })
                if (data) {
                    // console.log(data.search.items)
                    if (data.search.items > 0) {
                        await getMedicine({
                            variables: {
                                name: word
                            }
                        })
                        // setDrugsData(data.search.drugs)
                        return;
                    }
                }
            })
    }, [])

    useEffect(() => {
        props.navigation.setOptions({
            headerRight: () => (
                <IconWithBadge
                    iconColor='#FFF'
                    iconName='cart'
                    iconSize={24}
                    value={DrugStore.count}
                    badgeColor="red"
                    onPress={() => props.navigation.navigate("Cart")}
                />
            ),
            headerLargeTitle: false,
        });
    }, []);

    if (loading || countLoading) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: colors.PRIMARY,
                }}>
                <ActivityIndicator
                    color="#FFF"
                    size="large"
                />
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
            {!!data ?
                <FlatList
                    ListHeaderComponent={
                        <View style={{ marginVertical: 10, marginStart: 5 }}>
                            <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#fff' }}>
                                {data.search.drugs.length} Medicines found
                            </Text>
                        </View>
                    }
                    data={data.search.drugs}
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
                    <Text style={{ color: "#fff" }}>No Medicines Found.</Text>
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

export default ScannedResultsScreen;
