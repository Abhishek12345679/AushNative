import { View, StatusBar, TextInput } from 'react-native'
import React from 'react'
import RoundButton from './RoundButton'

import { Ionicons } from '@expo/vector-icons'
import { colors } from '../constants/colors'

interface SearchBarProps {
    navigation: any;
    onChangeText: (text: string) => any;
    searchText: string;
    onSubmitEditing: () => void
}

const SearchBar = ({ navigation, onChangeText, searchText, onSubmitEditing }: SearchBarProps) => {
    return (
        <View
            style={{
                flexDirection: 'row',
                marginTop: StatusBar.currentHeight + 50,
            }}>
            <View
                style={{
                    width: '100%',
                    height: 60,
                    marginBottom: 10,
                    flexDirection: 'row',
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
                    onSubmitEditing={onSubmitEditing}
                    returnKeyType="search"
                    placeholder="search here"
                    placeholderTextColor="#ccc"
                    value={searchText}
                    onChangeText={onChangeText}
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
    )
}

export default SearchBar