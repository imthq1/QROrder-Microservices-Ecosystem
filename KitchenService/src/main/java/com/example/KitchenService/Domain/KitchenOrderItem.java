package com.example.KitchenService.Domain;

import com.example.KitchenService.Util.KitchenCancelReason;
import com.example.KitchenService.Util.KitchenOrderItemStatus;
import com.example.KitchenService.Util.KitchenOrderStatus;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "kitchen_order_item")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KitchenOrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "kitchen_order_id", nullable = false)
    @JsonBackReference
    private KitchenOrder kitchenOrder;

    @Column(length = 255)
    private String note;

    @Column(name = "order_item_id", nullable = false)
    private Integer orderItemId;

    @Column(name = "menu_item_id", nullable = false)
    private Integer menuItemId;

    @Column(name = "menu_item_name")
    private String menuItemName;

    private Integer quantity;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private KitchenOrderItemStatus status;

    @Enumerated(EnumType.STRING)
    private KitchenCancelReason cancelReason;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
