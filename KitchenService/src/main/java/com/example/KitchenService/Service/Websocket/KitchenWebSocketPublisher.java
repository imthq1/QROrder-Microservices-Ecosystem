package com.example.KitchenService.Service.Websocket;

import com.example.KitchenService.Domain.DTO.KitchenOrderItemWsDto;
import com.example.KitchenService.Domain.DTO.KitchenOrderWsDto;
import com.example.KitchenService.Domain.KitchenOrder;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class KitchenWebSocketPublisher {

    private final SimpMessagingTemplate messagingTemplate;

    public void pushNewOrder(KitchenOrder order) {
        KitchenOrderWsDto dto = mapToDto(order);
        messagingTemplate.convertAndSend("/topic/kitchen/orders", dto);
    }

    private KitchenOrderWsDto mapToDto(KitchenOrder order) {
        return KitchenOrderWsDto.builder()
                .kitchenOrderId(order.getId())
                .orderId(order.getOrderId())
                .tableId(order.getTableId())
                .sessionId(order.getSessionId())
                .status(order.getStatus())
                .createdAt(order.getCreatedAt())
                .items(order.getItems().stream()
                        .map(i -> KitchenOrderItemWsDto.builder()
                                .id(i.getId())
                                .orderItemId(i.getOrderItemId())
                                .menuItemId(i.getMenuItemId())
                                .menuItemName(i.getMenuItemName())
                                .quantity(i.getQuantity())
                                .note(i.getNote())
                                .status(i.getStatus())
                                .build())
                        .toList())
                .build();
    }
}
