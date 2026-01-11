package com.example.KitchenService.Service;

import com.example.KitchenService.Domain.KitchenOrder;
import com.example.KitchenService.Repository.KitchenOrderRepository;
import com.example.KitchenService.Util.KitchenOrderStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class KitchenService {
    private final KitchenOrderRepository kitchenOrderRepository;
    public KitchenService(KitchenOrderRepository kitchenOrderRepository) {
        this.kitchenOrderRepository = kitchenOrderRepository;
    }
    public List<KitchenOrder> getActiveOrders() {
        return kitchenOrderRepository.findByStatusOrderByCreatedAtAsc(KitchenOrderStatus.COOKING);
    }
    public List<KitchenOrder> getActiveOrdersByStatus(KitchenOrderStatus status) {
        return kitchenOrderRepository.findByStatusOrderByCreatedAtAsc(status);
    }
}
