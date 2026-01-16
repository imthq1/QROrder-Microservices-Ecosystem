package com.example.OrderService.Domain.ResDTO;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class OrderDashboardSummary {
    private long totalOrders;
    private long onProcess;
    private long completed;
    private long cancelled;
}
