package com.example.MenuService.Domain.ResDTO;


import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
public class ItemResponse {
    private int id;
    private String name;
    private String description;
    private double price;
    private String thumbnailUrl;
    private boolean isAvailable;
    private Instant createdAt;
    private Integer categoryId;
    private String categoryName;
}