import { Text, View } from 'react-native';
import React, { MutableRefObject, useMemo, useRef } from 'react';
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


    return (

        <View
            key={keyProp}
            style={{
                position: 'absolute',
                borderWidth: 1,
                borderColor: '#FFF',
                padding: 15,
                borderRadius: 2,
                elevation: 1,
                ...rect,
            }}
        >
            <Popable
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
                    }}
                >

                </View>
            </Popable>
        </View>

    );
}

export default BoundingBox;
