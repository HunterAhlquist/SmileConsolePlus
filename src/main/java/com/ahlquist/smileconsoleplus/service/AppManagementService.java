package com.ahlquist.smileconsoleplus.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class AppManagementService {
    public String[] returnAvailableApps() {
        List<String> appNames = new ArrayList<>();
        appNames.add("term");
        appNames.add("netconf");
        appNames.add("about");
        appNames.add("help");
        return appNames.toArray(new String[0]);
    }
}
