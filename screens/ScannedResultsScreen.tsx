import React, { useEffect, useState } from 'react';
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
import { useLazyQuery, useQuery } from '@apollo/client';
import DrugStore, { DrugType } from '../store/CartStore';
import { observer } from 'mobx-react';

import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { GET_MEDICINE } from './ResultList';


const ScannedResultsScreen = observer((props: any) => {
    const words = props.route.params.words as Array<string>
    console.log(words)
    const [drugsData, setDrugsData] = useState<DrugType[] | undefined | null>(undefined)

    const [getMedicine, { loading, data, error }] = useLazyQuery(GET_MEDICINE);

    useEffect(() => {
        words.map((word) => {
            getMedicine({ variables: { name: word } });
            if (data) {
                setDrugsData(data.search.drugs)
                return;
            }
        })
    }, [])

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
            {!!drugsData ?
                <FlatList
                    ListHeaderComponent={
                        <View style={{ marginVertical: 10, marginStart: 5 }}>
                            <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#fff' }}>
                                {drugsData.length} Medicines found
                            </Text>
                        </View>
                    }
                    data={drugsData}
                    renderItem={({ item, index }) => {
                        return (
                            <ListItem
                                keyProp={index}
                                style={{
                                    backgroundColor: colors.PRIMARY,
                                }}
                                title={item.name}
                                subtitle={`${item.salt.substring(0, 20)}...`}
                                imageUrl={item.imageUrl}
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
