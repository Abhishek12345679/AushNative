import { Text, TouchableOpacity, View } from 'react-native';
import React, { useMemo } from 'react';
import { BoundingBoxType } from '../mlkit/TextRecognition';

interface BoundingBoxProps {
    text?: string;
    boundingBox: BoundingBoxType;
    keyProp?: number | string;
    scale: number;
    navigation: any;
}

const BoundingBox = ({ boundingBox, text, keyProp, scale, navigation }: BoundingBoxProps) => {
    const rect = useMemo(() => {
        return {
            left: boundingBox.left * scale,
            top: boundingBox.top * scale + 30,
            height: boundingBox.height * scale,
            width: boundingBox.width * scale,
        }
    }, [
        scale,
        text
    ])
    return (
        <View
            key={keyProp}
            style={{
                position: 'absolute',
                borderWidth: 0.35,
                borderColor: '#FFF',
                padding: 15,
                borderRadius: 2,
                elevation: 1,
                ...rect,
            }}
        // onPress={() => {
        //     navigation.navigate("Results", {
        //         data: text,
        //         mode: "scan"
        //     })
        // }}
        >
            <Text style={{ color: "black", fontWeight: 'bold' }}>
                {text}
            </Text>
        </View>
    );
}

export default BoundingBox;
