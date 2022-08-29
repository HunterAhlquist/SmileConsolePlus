package com.ahlquist.smileconsoleplus.service;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class AppManagementService {
    private final List<String> appNames;
    private final List<String> demonNames;

    public AppManagementService(){
        appNames = getResourceFiles("/static/bin/app/");
        demonNames = getResourceFiles("/static/bin/demon/");
    }
    public String[] returnAvailableApps() {
        return appNames.toArray(new String[0]);
    }
    public String[] returnAvailableDemons() {
        return demonNames.toArray(new String[0]);
    }

    private List<String> getResourceFiles(String path) {
        List<String> filenames = new ArrayList<>();

        try (InputStream in = getResourceAsStream(path);
                BufferedReader br = new BufferedReader(new InputStreamReader(in))) {
            String resource;

            while ((resource = br.readLine()) != null) {
                filenames.add(resource);
            }
        } catch (Exception e) {
            return new ArrayList<>();
        }

        return filenames;
    }

    private InputStream getResourceAsStream(String resource) {
        final InputStream in
                = getContextClassLoader().getResourceAsStream(resource);

        return in == null ? getClass().getResourceAsStream(resource) : in;
    }

    private ClassLoader getContextClassLoader() {
        return Thread.currentThread().getContextClassLoader();
    }
}
