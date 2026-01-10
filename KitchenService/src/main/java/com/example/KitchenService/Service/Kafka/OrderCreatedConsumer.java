package com.example.KitchenService.Service.Kafka;

import com.example.KitchenService.Domain.Kafka.OrderCreatedEvent;
import com.example.KitchenService.Domain.KitchenOrder;
import com.example.KitchenService.Domain.KitchenOrderItem;
import com.example.KitchenService.Repository.KitchenOrderRepository;
import com.example.KitchenService.Service.Websocket.KitchenWebSocketPublisher;
import com.example.KitchenService.Util.KitchenOrderItemStatus;
import com.example.KitchenService.Util.KitchenOrderStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderCreatedConsumer {

    private final KitchenOrderRepository kitchenOrderRepository;
    private final KitchenWebSocketPublisher kitchenWebSocketPublisher;

    @KafkaListener(topics = "order-created", groupId = "kitchen-service")
    public void consume(OrderCreatedEvent event) {

        KitchenOrder order = KitchenOrder.builder()
                .orderId(event.getOrderId())
                .tableId(event.getTableId())
                .sessionId(event.getSessionId())
                .status(KitchenOrderStatus.COOKING)
                .build();

        List<KitchenOrderItem> items = event.getItems().stream()
                .map(i -> KitchenOrderItem.builder()
                        .kitchenOrder(order)
                        .orderItemId(i.getOrderItemId())
                        .menuItemId(i.getProductId())
                        .menuItemName(i.getProductName())
                        .quantity(i.getQuantity())
                        .note(i.getNote())
                        .status(KitchenOrderItemStatus.COOKING)
                        .build())
                .toList();

        order.setItems(items);

        KitchenOrder savedOrder = kitchenOrderRepository.save(order);
        kitchenWebSocketPublisher.pushNewOrder(savedOrder);
        log.info("Kitchen received order {}", event.getOrderId());
    }


}
