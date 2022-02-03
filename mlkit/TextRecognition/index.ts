import { NativeModules } from "react-native";

const { MLKitTextRecognitionModule } = NativeModules;

export type BoundingBoxType = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export type Word = {
  text: string;
  rect: BoundingBoxType;
};

export type Line = {
  text: string;
  rect: BoundingBoxType;
  words: Array<Word>;
};

export type Block = {
  text: string;
  rect: BoundingBoxType;
  lines: Array<Line>;
};

export type TextRecognitionResponse = {
  width: number;
  height: number;
  blocks: Array<Block>;
};

export const extractWords = async (
  url: string
): Promise<TextRecognitionResponse> => {
  return await MLKitTextRecognitionModule.extractWords(url);
};
