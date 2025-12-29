package com.example.MenuService.Domain.ResDTO;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CategoryResponse {
    private int id;
    private String name;
    private String description;
    private int displayOrder;
    private List<ItemResponse> items;
}
