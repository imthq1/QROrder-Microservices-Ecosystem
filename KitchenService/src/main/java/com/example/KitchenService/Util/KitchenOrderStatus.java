package com.example.KitchenService.Util;

public enum KitchenOrderStatus {
    RECEIVED,   // Nhận từ Order Service
    COOKING,    // Có ít nhất 1 món đang nấu
    DONE,       // Tất cả món DONE
    CANCELLED   // Tất cả món CANCELLED
}
