package com.example.OrderService.Domain.ResDTO;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class PageResponse<T> {

    private List<T> data;

    private int page;
    private int size;

    private long totalElements;
    private int totalPages;

    private boolean last;
}
