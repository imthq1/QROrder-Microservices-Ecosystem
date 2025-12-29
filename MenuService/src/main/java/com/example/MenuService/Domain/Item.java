package com.example.MenuService.Domain;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Item {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String name;
    private String description;
    private double price;
    private String thumbnail_url;
    @Column(name = "is_available")
    private boolean isAvailable=true;

    private Instant created_at;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cate_id")
    @JsonBackReference
    private Category category;
    @PrePersist
    protected void onCreate() {
        created_at = Instant.now();
    }
}
