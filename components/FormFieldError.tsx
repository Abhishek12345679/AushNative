import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { colors } from '../constants/colors';

interface FormFieldErrorTypes {
    errorText: string
}

const FormFieldError = ({ errorText }: FormFieldErrorTypes) => {
    return (
        <View style={styles.errorContainer}>
            <MaterialCommunityIcons name="close-circle" size={18} color="#FF3232" />
            <Text style={styles.errorText}>{errorText}</Text>
        </View>
    )
};

const styles = StyleSheet.create({
    errorText: {
        color: "#FFF",
        fontWeight: 'normal',
        marginStart: 10,
        fontSize: 15
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        // backgroundColor: colors.SECONDARY,
        width: 175,
        padding: 5,
        borderRadius: 5,
        marginBottom: 15
    }
})



export default FormFieldError