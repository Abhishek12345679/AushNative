import { View, StyleSheet } from 'react-native';
import React, { useRef, useState } from 'react';
import { TextRecognitionResponse } from '../mlkit/TextRecognition';
import BoundingBox from './BoundingBox';

export interface RecognisedWordsOverlayProps {
    response: TextRecognitionResponse;
    scale: number;
    navigation: any;
}

const RecognisedWordsOverlay = ({ response, scale, navigation }: RecognisedWordsOverlayProps) => {

    const words = response.blocks.flatMap((block) => {
        return block.lines.flatMap((line) => {
            return line.words.flatMap((word) => {
                return word;
            });
        });
    });

    // const firstBlock = response.blocks[0];
    // const lastBlock = response.blocks[response.blocks.length - 1];

    // const textArea = {
    //     left: firstBlock.rect.left < lastBlock.rect.left ? firstBlock.rect.left : lastBlock.rect.left,
    //     top: firstBlock.rect.top,
    //     height: lastBlock.rect.top - firstBlock.rect.top + lastBlock.rect.height,
    //     width: firstBlock.rect.left < lastBlock.rect.left ? lastBlock.rect.left + lastBlock.rect.width : firstBlock.rect.left
    // }

    // console.log(response.blocks.length)

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
                    return (
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
