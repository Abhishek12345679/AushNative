import { View, Text } from 'react-native';
import React, { useMemo } from 'react';
import { BoundingBoxType } from '../mlkit/TextRecognition';

interface BoundingBoxProps {
    text: string;
    boundingBox: BoundingBoxType;
    keyProp: number | string;
    scale: number
}

const BoundingBox = ({ boundingBox, text, keyProp, scale }: BoundingBoxProps) => {
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
        <View
            key={keyProp}
            style={{
                position: 'absolute',
                borderWidth: 1,
                borderColor: 'red',
                ...rect,
            }}
        >
            <Text style={{ color: "red", fontWeight: 'bold' }}>
                {text}
            </Text>
        </View>
    );
}

export default BoundingBox;
