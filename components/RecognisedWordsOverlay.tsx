import { View, StyleSheet } from 'react-native';
import React from 'react';
import { TextRecognitionResponse } from '../mlkit/TextRecognition';
import BoundingBox from './BoundingBox';

export interface RecognisedWordsOverlayProps {
    response: TextRecognitionResponse;
    scale: number;
    navigation: any;
}

const RecognisedWordsOverlay = ({ response, scale, navigation }: RecognisedWordsOverlayProps) => {

    const words = response.blocks.flatMap((block, i) => {
        return block.lines.flatMap((line, i) => {
            return line.words.flatMap((word, i) => {
                return word
            })
        })
    })
    return (
        <View
            style={{
                ...StyleSheet.absoluteFillObject,
                ...{
                    backgroundColor: "#00000050"
                }
            }}
        >
            {
                !!words && words.map((word, i) => {
                    console.log("word: ", word);
                    return (
                        <BoundingBox
                            keyProp={i}
                            boundingBox={word.rect}
                            text={word.text}
                            scale={scale}
                            navigation={navigation}
                        />
                    )
                })
            }
        </View >
    );
}

export default RecognisedWordsOverlay;
