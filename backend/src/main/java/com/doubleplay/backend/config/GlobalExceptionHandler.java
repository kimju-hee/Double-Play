package com.doubleplay.backend.config;

import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<?> handleIllegal(IllegalArgumentException e) {
        String msg = e.getMessage();
        if ("invalid".equalsIgnoreCase(msg)) {
            return ResponseEntity.status(401).body(Map.of(
                    "success", false,
                    "message", "이메일 또는 비밀번호가 올바르지 않습니다."
            ));
        }
        return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", msg == null ? "잘못된 요청입니다." : msg
        ));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValid(MethodArgumentNotValidException e) {
        Map<String, String> errors = e.getBindingResult().getFieldErrors().stream()
                .collect(Collectors.toMap(FieldError::getField, FieldError::getDefaultMessage, (a, b)->a));
        return ResponseEntity.badRequest().body(Map.of("success", false, "errors", errors));
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<?> handleParse(HttpMessageNotReadableException e) {
        return ResponseEntity.badRequest().body(Map.of("success", false, "message",
                "요청 본문을 해석할 수 없습니다: " + e.getMostSpecificCause().getMessage()));
    }
}