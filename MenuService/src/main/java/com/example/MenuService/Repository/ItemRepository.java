package com.example.MenuService.Repository;

import com.example.MenuService.Domain.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemRepository extends JpaRepository<Item, Integer> {
    List<Item> findByCategoryId(int categoryId);

    @Query(value = "SELECT * FROM item WHERE is_available = true", nativeQuery = true)
    List<Item> findByIsAvailableTrue();
    List<Item> findByCategoryIdAndIsAvailableTrue(int categoryId);

    @Query("SELECT i FROM Item i WHERE LOWER(i.name) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Item> searchByName(@Param("keyword") String keyword);
}