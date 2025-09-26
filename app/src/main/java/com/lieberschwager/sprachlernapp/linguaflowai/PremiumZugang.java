package com.lieberschwager.sprachlernapp.linguaflowai;

import android.content.Context;
import android.content.res.AssetManager;
import org.json.JSONObject;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

public class PremiumZugang {

    private final Context context;

    public PremiumZugang(Context context) {
        this.context = context;
    }

    public boolean isPremiumAktiv() {
        try {
            AssetManager am = context.getAssets();
            InputStream is = am.open("linguaflowai/config.json");
            byte[] buffer = new byte[is.available()];
            is.read(buffer);
            is.close();
            String json = new String(buffer, StandardCharsets.UTF_8);
            JSONObject config = new JSONObject(json);
            return config.optBoolean("premiumActive", false);
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public String ladeTheme() {
        try {
            AssetManager am = context.getAssets();
            InputStream is = am.open("linguaflowai/themes.json");
            byte[] buffer = new byte[is.available()];
            is.read(buffer);
            is.close();
            return new String(buffer, StandardCharsets.UTF_8);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    // Weitere Methoden: unlock.js ausführen, store.js laden etc.
}