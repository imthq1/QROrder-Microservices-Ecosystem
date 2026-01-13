package com.example.KitchenService.Domain.DTO;

import com.example.KitchenService.Util.KitchenOrderStatus;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class KitchenOrderWsDto {
    private Integer kitchenOrderId;
    private Integer orderId;
    private Integer tableId;
    private String sessionId;
    private KitchenOrderStatus status;
    private List<KitchenOrderItemWsDto> items;
    private LocalDateTime createdAt;
}
