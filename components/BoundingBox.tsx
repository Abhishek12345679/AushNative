import { Pressable, Text, View } from 'react-native';
import React, { MutableRefObject, useMemo, useRef, useState } from 'react';
import { BoundingBoxType } from '../mlkit/TextRecognition';

import { Popable } from 'react-native-popable';

interface BoundingBoxProps {
    text?: string;
    boundingBox: BoundingBoxType;
    keyProp?: number | string;
    scale: number;
    onPress?: () => void;

    textToolTipVisible?: boolean;
    parentRef?: MutableRefObject<View>
}

const BoundingBox = ({
    boundingBox,
    text,
    keyProp,
    scale,
}: BoundingBoxProps) => {
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
    ]);

    const [visible, setVisible] = useState(false)


    return (
        <View
            key={keyProp}
            style={{
                position: 'absolute',
                borderWidth: 1,
                borderColor: '#FFF',
                padding: 10,
                borderRadius: 3,
                elevation: 1,
                backgroundColor: "#FFFFFF30",
                ...rect,
            }}
        >
            <Popable
                // visible={visible}
                animated={true}
                animationType="spring"
                action="press"
                caret={true}
                strictPosition={true}
                position="top"
                caretPosition="center"
                style={{
                    marginBottom: 30,
                }}
                content={
                    <View
                        style={{
                            padding: 10,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#000',
                        }}
                    >
                        <Text style={{ color: "#FFF", fontWeight: "bold" }}>{text}</Text>
                    </View>
                }
            >
                <View
                    style={{
                        width: '100%',
                        height: 20,
                        backgroundColor: "#FFFFFF00"
                    }}
                >
                </View>
            </Popable>
        </View>
    );
}

export default BoundingBox;
