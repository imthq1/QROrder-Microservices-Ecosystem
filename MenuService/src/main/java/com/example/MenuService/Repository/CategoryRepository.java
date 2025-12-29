package com.example.MenuService.Repository;

import com.example.MenuService.Domain.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {
    Optional<Category> findByName(String name);
    @Query("SELECT c FROM Category c ORDER BY c.display_order ASC")
    List<Category> findAllByOrderByDisplay_orderAsc();

}