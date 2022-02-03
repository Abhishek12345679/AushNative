import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { TextRecognitionResponse, Word } from '../mlkit/TextRecognition';
import BoundingBox from './BoundingBox';


export interface RecognisedWordsOverlayProps {
    response: TextRecognitionResponse;
    scale: number;
}

const RecognisedWordsOverlay = ({ response, scale }: RecognisedWordsOverlayProps) => {
    return (
        <View
            style={StyleSheet.absoluteFillObject}
        >
            {
                response.blocks.map((block, i) => {
                    block.lines.map((line, i) => {
                        line.words.map((word, i) => {
                            // console.log("word: ", word);
                            return (
                                <BoundingBox
                                    keyProp={i}
                                    boundingBox={word.rect}
                                    text={word.text}
                                    scale={scale}
                                />
                            )
                        }
                        )
                    })
                })
            }
        </View >
    );
}

export default RecognisedWordsOverlay;
