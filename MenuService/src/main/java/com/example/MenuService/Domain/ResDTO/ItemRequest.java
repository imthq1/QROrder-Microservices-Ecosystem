package com.example.MenuService.Domain.ResDTO;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ItemRequest {
    private String name;
    private String description;
    private double price;
    private String thumbnailUrl;
    private boolean isAvailable;
    private int categoryId;
}
