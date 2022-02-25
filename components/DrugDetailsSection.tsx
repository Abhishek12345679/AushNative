import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { MaterialIcons } from '@expo/vector-icons'

interface DrugDetailsSectionProps {
    label: string;
    onPress: () => void;
    children: JSX.Element;
}

const DrugDetailsSection = ({ label, onPress, children }: DrugDetailsSectionProps) => {
    return (
        <View style={styles.desc}>
            <View style={styles.sectionHeaderStyle}>
                <Text style={{ ...styles.salt, fontWeight: 'bold' }}>
                    {label}
                </Text>
                <MaterialIcons
                    name="keyboard-arrow-down"
                    size={22}
                    color="#FFF"
                    onPress={onPress}
                />
            </View>
            {children}
        </View>
    )
}

const styles = StyleSheet.create({
    salt: {
        fontSize: 15,
        color: '#FFF',
        fontWeight: 'normal',
    },
    desc: {
        justifyContent: 'flex-start',
        paddingHorizontal: 25,
        marginVertical: 20,
        color: '#fff',
    },
    sectionHeaderStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    }
});

export default DrugDetailsSection