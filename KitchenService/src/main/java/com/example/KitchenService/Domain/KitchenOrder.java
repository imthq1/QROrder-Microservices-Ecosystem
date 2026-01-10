package com.example.KitchenService.Domain;

import com.example.KitchenService.Util.KitchenOrderStatus;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "kitchen_order")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KitchenOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "order_id", nullable = false)
    private Integer orderId;

    @Column(name = "session_id", nullable = false)
    private String sessionId;

    @Column(name = "table_id", nullable = false)
    private Integer tableId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private KitchenOrderStatus status;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @OneToMany(
            mappedBy = "kitchenOrder",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @JsonManagedReference
    private List<KitchenOrderItem> items = new ArrayList<>();
}
