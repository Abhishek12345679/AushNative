package com.aush.aush.mlkit;

import android.annotation.SuppressLint;
import android.graphics.Rect;
import android.net.Uri;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.Task;
import com.google.mlkit.vision.common.InputImage;
import com.google.mlkit.vision.text.Text;
import com.google.mlkit.vision.text.TextRecognition;
import com.google.mlkit.vision.text.TextRecognizer;
import com.google.mlkit.vision.text.latin.TextRecognizerOptions;

import java.io.IOException;

public class MLKitTextRecognitionModule extends ReactContextBaseJavaModule {
    MLKitTextRecognitionModule(ReactApplicationContext context) {
        super(context);
    }

    @NonNull
    @Override
    public String getName() {
        return "MLKitTextRecognitionModule";
    }

    public WritableMap Rect2Map(Rect rect){
        WritableMap rectObject = Arguments.createMap();
        rectObject.putInt("left",rect.left);
        rectObject.putInt("top",rect.top);
        rectObject.putInt("width",(rect.right - rect.left));
        rectObject.putInt("height",(rect.bottom - rect.top));

        return rectObject;
    }

    @SuppressLint("LongLogTag")
    @ReactMethod
    public void extractWords(String url, Promise promise) {
        InputImage image;
        Uri uri = Uri.parse(url);
        try {
            image = InputImage.fromFilePath(getReactApplicationContext(),uri);
            TextRecognizer recognizer = TextRecognition.getClient(TextRecognizerOptions.DEFAULT_OPTIONS);

            Task<Text> result =
                    recognizer.process(image)
                            .addOnSuccessListener(new OnSuccessListener<Text>() {
                                @Override
                                public void onSuccess(Text result) {
                                    //maps are like objects in JS
                                    WritableMap response = Arguments.createMap();
                                    response.putInt("width",image.getWidth());
                                    response.putInt("height",image.getHeight());

                                    WritableArray blocks = Arguments.createArray();
                                    for (Text.TextBlock block : result.getTextBlocks()) {
                                        WritableMap blockObject = Arguments.createMap();
                                        blockObject.putString("text",block.getText());
                                        blockObject.putMap("rect",Rect2Map(block.getBoundingBox()));

                                        WritableArray lines = Arguments.createArray();
                                        for (Text.Line line : block.getLines()) {
                                            WritableMap lineObject = Arguments.createMap();
                                            lineObject.putString("text",line.getText());
                                            lineObject.putMap("rect",Rect2Map(line.getBoundingBox()));

                                            WritableArray words = Arguments.createArray();
                                            for (Text.Element word : line.getElements()) {
                                                if(word.getText().length() > 4){
                                                    WritableMap wordObject = Arguments.createMap();
                                                    wordObject.putString("text",word.getText());
                                                    wordObject.putMap("rect",Rect2Map(word.getBoundingBox()));
                                                    words.pushMap(wordObject);
                                                }
                                            }
                                            lineObject.putArray("words",words);
                                            lines.pushMap(lineObject);

                                        }
                                        blockObject.putArray("lines",lines);
                                        blocks.pushMap(blockObject);
                                    }
                                    response.putArray("blocks",blocks);
                                    promise.resolve(response);
                                }
                            })
                            .addOnFailureListener(
                                    new OnFailureListener() {
                                        @Override
                                        public void onFailure(@NonNull Exception e) {
                                            // Task failed with an exception
                                            promise.reject("Text Recognition Failed!!", e);
                                        }
                                    });

        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
