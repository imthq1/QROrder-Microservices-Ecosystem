package com.example.KitchenService.Domain.Kafka;

import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderCreatedEvent {

    private Integer orderId;
    private Integer tableId;
    private String sessionId;
    private List<OrderItemEvent> items;
}
