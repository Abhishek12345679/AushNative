import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { TextRecognitionResponse, Word } from '../mlkit/TextRecognition';
import BoundingBox from './BoundingBox';


export interface RecognisedWordsOverlayProps {
    response: TextRecognitionResponse;
    scale: number;
}

const RecognisedWordsOverlay = ({ response, scale }: RecognisedWordsOverlayProps) => {

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
            {/* {["a", "b", "c"].map((text, i) => <Text style={{ color: "#000", fontSize: 25, fontWeight: 'bold' }}>{text}</Text>)} */}
            {
                !!words && words.map((word, i) => {
                    console.log("word: ", word);
                    return (
                        // <Text>{word.text}</Text>
                        <BoundingBox
                            keyProp={i}
                            boundingBox={word.rect}
                            text={word.text}
                            scale={scale}
                        />
                    )
                })
            }
        </View >
    );
}

export default RecognisedWordsOverlay;
