package com.doubleplay.backend.util;

import org.springframework.http.ResponseCookie;

public class CookieUtil {
    public static ResponseCookie httpOnly(String name, String value, long maxAgeSec) {
        return ResponseCookie.from(name, value).httpOnly(true).secure(true).sameSite("None").path("/").maxAge(maxAgeSec).build();
    }
}