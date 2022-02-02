package com.aush.aush.mlkit;

import android.annotation.SuppressLint;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class MLKitTextRecognitionModule extends ReactContextBaseJavaModule {
    MLKitTextRecognitionModule(ReactApplicationContext context) {
        super(context);
    }

    @NonNull
    @Override
    public String getName() {
        return "MLKitTextRecognitionModule";
    }

    @SuppressLint("LongLogTag")
    @ReactMethod
    public void extractWords(String url) {
        Log.d("MLKitTextRecognitionModule", "url= "+url);
    }
}
