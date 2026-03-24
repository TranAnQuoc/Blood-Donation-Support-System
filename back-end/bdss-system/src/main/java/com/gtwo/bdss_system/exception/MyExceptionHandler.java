package com.gtwo.bdss_system.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class MyExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationException(MethodArgumentNotValidException ex) {
        Map<String, String> fieldErrors = new LinkedHashMap<>();
        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            fieldErrors.put(error.getField(), error.getDefaultMessage());
        }

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("message", "Dữ liệu gửi lên không hợp lệ");
        body.put("errors", fieldErrors);
        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalArgumentException(IllegalArgumentException ex) {
        Map<String, String> fieldErrors = new LinkedHashMap<>();
        String rawMessage = ex.getMessage() == null ? "" : ex.getMessage().trim();

        if (rawMessage.contains("|")) {
            String[] parts = rawMessage.split("\\|", 2);
            String field = parts[0].trim();
            String message = parts.length > 1 ? parts[1].trim() : "Dữ liệu không hợp lệ";
            fieldErrors.put(field, message);
        }

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("message", rawMessage.isEmpty() ? "Dữ liệu không hợp lệ" : rawMessage);
        if (!fieldErrors.isEmpty()) {
            body.put("errors", fieldErrors);
        }

        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGeneralException(Exception ex) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("message", "Lỗi hệ thống: " + ex.getMessage());
        return new ResponseEntity<>(body, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
