import { NativeModules } from "react-native";

const { MLKitTextRecognitionModule } = NativeModules;

export type BoundingBox = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export type Line = {
  text: string;
  rect: BoundingBox;
};

export type Block = {
  text: string;
  rect: BoundingBox;
  lines: Array<Line>;
};

export type Response = {
  width: number;
  height: number;
  blocks: Array<Block>;
};

export const extractWords = (url: string): Promise<Response> => {
  return MLKitTextRecognitionModule.extractWords(url);
};
