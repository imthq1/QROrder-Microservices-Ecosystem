package com.example.KitchenService.Controller;

import com.example.KitchenService.Domain.KitchenOrder;
import com.example.KitchenService.Service.KitchenService;
import com.example.KitchenService.Util.KitchenOrderStatus;
import jakarta.persistence.Table;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/kitchens")
public class KitchenController {
    private final KitchenService kitchenService;
    public KitchenController(KitchenService kitchenService) {
        this.kitchenService = kitchenService;
    }
    @GetMapping("/orders")
    public List<KitchenOrder> getOrders(
            @RequestParam(required = false) KitchenOrderStatus status
    ) {
        if (status == null) {
            return kitchenService.getActiveOrders();
        }
        return kitchenService.getActiveOrdersByStatus(status);
    }

}
