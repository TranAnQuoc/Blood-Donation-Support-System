package com.gtwo.bdss_system.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum Gender {
    MALE("MALE"),
    FEMALE("FEMALE"),
    OHTER("OTHER");

    private final String apiValue;

    Gender(String apiValue) {
        this.apiValue = apiValue;
    }

    @JsonValue
    public String getApiValue() {
        return apiValue;
    }

    @JsonCreator
    public static Gender fromValue(String value) {
        if (value == null) {
            return null;
        }

        return switch (value.trim().toUpperCase()) {
            case "MALE" -> MALE;
            case "FEMALE" -> FEMALE;
            case "OTHER", "OHTER" -> OHTER;
            default -> throw new IllegalArgumentException("Invalid gender value: " + value);
        };
    }
}
