package com.example.MenuService.Domain.ResDTO;

import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
public class TableResponse {
    private int id;
    private String numberTable;
    private int capacity;
    private String status;
    private String qrCode; // Token string
    private String qrCodeImage; // Base64 encoded PNG image
    private Instant createdAt;
}