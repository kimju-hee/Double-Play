package com.doubleplay.backend.dto;

import java.util.List;

public record ListResponse<T>(List<T> items) {}
