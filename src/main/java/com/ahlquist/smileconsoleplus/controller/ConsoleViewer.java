package com.ahlquist.smileconsoleplus.controller;

import com.ahlquist.smileconsoleplus.service.AppManagementService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ConsoleViewer {
    AppManagementService appMan;

    public ConsoleViewer(AppManagementService appMan) {
        this.appMan = appMan;
    }

    @GetMapping("/")
    public String GetConsoleViewer(Model model) {
        model.addAttribute("apps", appMan.returnAvailableApps());
        return "Viewer";
    }
}
