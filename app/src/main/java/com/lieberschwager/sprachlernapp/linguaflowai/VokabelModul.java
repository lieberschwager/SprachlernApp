package com.lieberschwager.sprachlernapp.linguaflowai;

import android.content.Context;
import android.content.res.AssetManager;
import org.json.JSONArray;
import org.json.JSONObject;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

public class VokabelModul {

    private final Context context;

    public VokabelModul(Context context) {
        this.context = context;
    }

    public List<String> getModuleNames(String languageCode, String level) {
        List<String> result = new ArrayList<>();
        try {
            AssetManager am = context.getAssets();
            InputStream is = am.open("linguaflowai/modules.json");
            byte[] buffer = new byte[is.available()];
            is.read(buffer);
            is.close();
            String json = new String(buffer, StandardCharsets.UTF_8);

            JSONArray modules = new JSONArray(json);
            for (int i = 0; i < modules.length(); i++) {
                JSONObject module = modules.getJSONObject(i);
                JSONArray langs = module.getJSONArray("availableLanguages");
                JSONArray levels = module.getJSONArray("levels");

                if (langs.toString().contains(languageCode) && levels.toString().contains(level)) {
                    result.add(module.getString("name"));
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }
}