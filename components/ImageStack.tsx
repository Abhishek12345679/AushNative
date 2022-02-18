import React from 'react'
import { View, Image } from 'react-native'
import { OrderType } from '../store/CartStore'

interface ImageStackProps {
    item: OrderType
}

const ImageStack = ({ item }: ImageStackProps) => {

    console.log("item: ", item)
    return (
        <View
            style={{
                width: 70,
                height: 70,
                position: "relative",
                marginEnd: 20,
                elevation: 10
            }}>
            {
                item.items.slice(0, item.items.length - 1 > 2 ? 2 : item.items.length)
                    .map((_item, index) => (
                        <Image
                            key={index}
                            source={{ uri: _item.imageUrl }}
                            style={{
                                width: 65,
                                height: 65,
                                borderRadius: 5,
                                marginTop: item.items.length < 2 ? 0 : index * 7,
                                marginLeft: item.items.length < 2 ? 0 : index * 7,
                                position: 'absolute',
                            }}
                        />
                    ))
            }
        </View>)
};

export default ImageStack