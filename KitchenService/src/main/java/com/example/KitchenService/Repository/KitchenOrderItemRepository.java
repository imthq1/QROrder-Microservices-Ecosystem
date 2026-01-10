package com.example.KitchenService.Repository;

import com.example.KitchenService.Domain.KitchenOrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface KitchenOrderItemRepository extends JpaRepository<KitchenOrderItem, Long> {
}
