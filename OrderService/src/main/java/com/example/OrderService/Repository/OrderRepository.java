package com.example.OrderService.Repository;

import com.example.OrderService.Domain.Order;
import com.example.OrderService.Util.Enum.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
    Page<Order> findByStatus(OrderStatus status, Pageable pageable);
    Page<Order> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);
    @Query("""
        SELECT COUNT(o) FROM Order o
    """)
    long countTotalOrders();

    @Query("""
        SELECT COUNT(o) FROM Order o WHERE o.status = :status
    """)
    long countByStatus(@Param("status") OrderStatus status);

    @Query("""
        SELECT SUM(o.totalAmount) FROM Order o
    """)
    BigDecimal totalRevenue();
}