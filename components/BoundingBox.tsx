import { View, Text, TouchableOpacity } from 'react-native';
import React, { useMemo } from 'react';
import { BoundingBoxType } from '../mlkit/TextRecognition';

interface BoundingBoxProps {
    text: string;
    boundingBox: BoundingBoxType;
    keyProp: number | string;
    scale: number;
    navigation: any;
}

const BoundingBox = ({ boundingBox, text, keyProp, scale, navigation }: BoundingBoxProps) => {
    const rect = useMemo(() => {
        return {
            left: boundingBox.left * scale,
            top: boundingBox.top * scale,
            height: boundingBox.height * scale,
            width: boundingBox.width * scale,
        }
    }, [
        scale,
        text
    ])
    return (
        <TouchableOpacity
            key={keyProp}
            style={{
                position: 'absolute',
                borderWidth: 1,
                borderColor: 'red',
                ...rect,
            }}
            onPress={() => {
                navigation.navigate("Results", {
                    data: text,
                    mode: "scan"
                })
            }}
        >
            <Text style={{ color: "red", fontWeight: 'bold' }}>
                {text}
            </Text>
        </TouchableOpacity >
    );
}

export default BoundingBox;
