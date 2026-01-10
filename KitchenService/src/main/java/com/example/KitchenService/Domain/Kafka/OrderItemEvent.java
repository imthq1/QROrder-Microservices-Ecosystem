package com.example.KitchenService.Domain.Kafka;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemEvent {

    private Integer orderItemId;
    private Integer productId;
    private String productName;
    private Integer quantity;
    private String note;
}
