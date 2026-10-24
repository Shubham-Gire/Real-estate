package com.example.realestate.common.exception;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.Instant;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class ErrorResponse {
    private Instant timestamp;
    private int status;
    private String code;
    private String message;
    private Map<String, String> fieldErrors;
    private String path;

    public ErrorResponse() {
        this.timestamp = Instant.now();
    }

    public ErrorResponse(int status, String code, String message, String path) {
        this.timestamp = Instant.now();
        this.status = status;
        this.code = code;
        this.message = message;
        this.path = path;
    }

    public ErrorResponse(int status, String code, String message, Map<String, String> fieldErrors, String path) {
        this.timestamp = Instant.now();
        this.status = status;
        this.code = code;
        this.message = message;
        this.fieldErrors = fieldErrors;
        this.path = path;
    }

    public Instant getTimestamp() { return timestamp; }
    public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }

    public int getStatus() { return status; }
    public void setStatus(int status) { this.status = status; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public Map<String, String> getFieldErrors() { return fieldErrors; }
    public void setFieldErrors(Map<String, String> fieldErrors) { this.fieldErrors = fieldErrors; }

    public String getPath() { return path; }
    public void setPath(String path) { this.path = path; }
}
