import { View, Text, Image, StyleSheet, Pressable } from 'react-native'
import React from 'react'
import { DrugType } from '../store/CartStore'
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons'
import { colors } from '../constants/colors'

interface CartItemProps {
    keyProp: number | string;
    drug: DrugType;
    removeFromCart: () => void
}


const CartItem = ({ keyProp, drug, removeFromCart }: CartItemProps) => {
    return (
        <View
            key={keyProp}
            style={{
                width: '100%',
                flexDirection: 'column',
                backgroundColor: colors.SECONDARY,
                borderRadius: 10,
                height: 130
            }}>
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: "space-evenly",
                    marginEnd: 10,
                    marginTop: 10,
                    marginStart: 20,
                    borderRadius: 20,
                }}>
                <Image
                    source={{ uri: drug.imageUrl }}
                    style={{
                        width: 50,
                        height: 50,
                        marginEnd: 20,
                        borderRadius: 5,
                    }}
                />
                <View style={{ marginEnd: 10 }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: "#fff" }}>
                        {drug.name}
                    </Text>
                    <Text style={{ fontSize: 15, width: 200, color: "#fff" }}>{drug.salt}</Text>
                </View>
                <Pressable
                    android_ripple={{
                        color: "#fff",
                        borderless: true
                    }}
                    onPress={removeFromCart}
                    style={{
                        height: 30,
                        width: 30
                    }}
                >
                    <FontAwesome
                        name="trash"
                        size={24}
                        color="#fff"
                    />
                </Pressable>
            </View>
            <View
                style={{
                    flexDirection: 'row',
                    marginHorizontal: 25,
                    marginTop: 20
                }}
            >
                <View style={styles.item}>
                    <FontAwesome name="balance-scale" color="#fff" size={15} />
                    <Text style={styles.subtext}>{drug.quantity}</Text>
                </View>
                <View style={styles.item}>
                    <FontAwesome5 name="money-bill-wave" color="#fff" size={15} />
                    <Text style={styles.subtext}>₹{drug.price}</Text>
                </View>
                <View
                    style={{
                        flexDirection: 'column',
                        marginTop: -15,
                        alignItems: 'center',
                    }}>
                    <Text style={{ color: "#fff", fontWeight: 'bold', marginBottom: -5 }}>Total</Text>
                    <View style={styles.item}>
                        <FontAwesome5 name="money-bill-wave" color="#fff" size={15} />
                        <Text style={styles.subtext}>₹{drug.total_amt}</Text>
                    </View>
                </View>
            </View>
        </View >
    )
}

const styles = StyleSheet.create({
    subtext: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 17,
        marginStart: 10
    },
    item: {
        height: 40,
        width: 110,
        flexDirection: 'row',
        alignItems: 'center'
    }

})

export default CartItem