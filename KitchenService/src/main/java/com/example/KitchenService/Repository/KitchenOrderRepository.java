package com.example.KitchenService.Repository;

import com.example.KitchenService.Domain.KitchenOrder;
import com.example.KitchenService.Util.KitchenOrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface KitchenOrderRepository extends JpaRepository<KitchenOrder, Long> {
    List<KitchenOrder> findByStatus(KitchenOrderStatus status);
}
