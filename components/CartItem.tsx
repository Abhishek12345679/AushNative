import { View, Text, Image } from 'react-native'
import React from 'react'
import { DrugType } from '../store/CartStore'
import { FontAwesome } from '@expo/vector-icons'

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
                flexDirection: 'column',
                backgroundColor: '#fff',
            }}>
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginEnd: 10,
                    marginTop: 10,
                    borderRadius: 20,
                }}>
                <Image
                    source={{ uri: drug.imageUrl }}
                    style={{
                        width: 75,
                        height: 75,
                        marginEnd: 10,
                    }}
                />
                <View style={{ marginEnd: 10 }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                        {drug.name}
                    </Text>
                    <Text style={{ fontSize: 15, width: 200 }}>{drug.salt}</Text>
                </View>
            </View>

            <View style={{ marginStart: 10, marginVertical: 10 }}>
                {/* <QuantitySelector /> */}
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingHorizontal: 10,
                    }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-around',
                        }}>
                        <Text style={{ color: 'green' }}>₹ {drug.price}</Text>
                        <Text> x {drug.quantity} = </Text>
                        <Text style={{ color: 'green', fontWeight: 'bold' }}>
                            ₹{drug.total_amt.toFixed(2)}
                        </Text>
                    </View>
                    <FontAwesome
                        name="trash"
                        size={24}
                        onPress={removeFromCart}
                    />
                </View>
            </View>
        </View>
    )
}

export default CartItem