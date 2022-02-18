import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { colors } from '../constants/colors';
import { toISTString } from '../helpers/toISTString';

interface OrderSummaryProps {
    totalAmt: number;
    datetimestamp: number;
    orderId?: string | number;
}

const OrderSummary = ({ totalAmt, datetimestamp, orderId }: OrderSummaryProps) => {
    return (
        <View style={styles.item}>
            <View style={styles.textContainer}>
                <Text style={{ color: "#fff" }}>Order Date</Text>
                <Text style={styles.boldtext}>
                    {toISTString(datetimestamp)}
                </Text>
            </View>
            {orderId &&
                <View style={styles.textContainer}>
                    <Text style={{ color: "#fff" }}>Order Id</Text>
                    <Text style={styles.boldtext}>{orderId}</Text>
                </View>
            }
            <View style={styles.textContainer}>
                <Text style={{ color: "#fff" }}>Total</Text>
                <Text style={styles.boldtext}>
                    ₹{totalAmt.toFixed(2)}
                </Text>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    item: {
        marginHorizontal: 25,
        marginVertical: 15,
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: colors.SECONDARY,
    },
    textContainer: {
        marginVertical: 10,
        justifyContent: 'space-between',
    },
    boldtext: {
        fontSize: 16,
        color: "#FFF",
        fontWeight: 'bold'
    },
});

export default OrderSummary