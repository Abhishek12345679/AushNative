import { NativeModules } from "react-native";

const { MLKitTextRecognitionModule } = NativeModules;

export const extractWords = (url) => {
  MLKitTextRecognitionModule.extractWords(url);
};
