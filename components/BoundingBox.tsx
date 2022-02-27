import React, { useMemo } from 'react';
import { Text, View } from 'react-native';
import { BoundingBoxType } from '../mlkit/TextRecognition';
import { Popable } from 'react-native-popable';

interface BoundingBoxProps {
    boundingBox: BoundingBoxType;
    text?: string;
    keyProp?: number | string;
    scale: number;
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
            top: boundingBox.top * scale,
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
                // padding: 10,
                borderRadius: 3,
                elevation: 1,
                backgroundColor: "#FFFFFF30",
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
                    /**
                     * the style for the popable
                     */
                    marginBottom: 30,
                }}
                wrapperStyle={{
                    backgroundColor: 'transparent',
                    flex: 1
                }}
                content={
                    <View
                        style={{
                            padding: 10,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Text style={{ color: "#FFF", fontWeight: "bold" }}>{text}</Text>
                    </View>
                }
            >
                <View
                    style={{
                        width: '100%',
                        height: 50,
                        backgroundColor: "transparent"
                    }}
                >
                </View>
            </Popable>
        </View>
    );
}

export default BoundingBox;
