package com.example.MenuService.Domain.ReqDTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CategoryRequest {
    private String name;
    private String description;
    private int displayOrder;
}