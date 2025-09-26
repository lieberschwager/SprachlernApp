package com.lieberschwager.sprachlernapp.linguaflowai;

import android.content.Context;
import android.content.res.AssetManager;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

public class KIManager {

    private final Context context;

    public KIManager(Context context) {
        this.context = context;
    }

    public String loadScript(String scriptName) {
        try {
            AssetManager am = context.getAssets();
            InputStream is = am.open("linguaflowai/ai/" + scriptName);
            byte[] buffer = new byte[is.available()];
            is.read(buffer);
            is.close();
            return new String(buffer, StandardCharsets.UTF_8);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    // Beispiel: KIManager.loadScript("whisper.js");
}