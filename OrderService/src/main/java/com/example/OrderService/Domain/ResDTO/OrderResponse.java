package com.example.OrderService.Domain.ResDTO;

import com.example.OrderService.Util.Enum.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
@Builder
public class OrderResponse {

    private Integer orderId;
    private Integer tableId;
    private LocalDateTime createdAt;
    private String customerName;
    private String orderType; // DINE_IN / TAKEAWAY / ONLINE
    private Integer quantity;
    private BigDecimal amount;
    private OrderStatus status;
}
