package com.example.MenuService.Repository;


import com.example.MenuService.Domain.Table;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TableRepository extends JpaRepository<Table, Integer> {
    Optional<Table> findByQrCode(String qrCode);
    Optional<Table> findByNumberTable(String numberTable);
}