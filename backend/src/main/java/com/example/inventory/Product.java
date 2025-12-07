package com.example.inventory;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data // Generates Getters and Setters
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private double price;
    private int quantity;
}