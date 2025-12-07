package com.example.inventory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*") // Allow React to connect
public class ProductController {

    @Autowired
    private ProductRepository repo;

    @GetMapping
    public List<Product> getAll() { return repo.findAll(); }

    @GetMapping("/{id}")
    public Product getById(@PathVariable Long id) { return repo.findById(id).orElse(null); }

    @PostMapping
    public Product create(@RequestBody Product p) { return repo.save(p); }

    @PutMapping("/{id}")
    public Product update(@PathVariable Long id, @RequestBody Product p) {
        p.setId(id);
        return repo.save(p);
    }

    @PatchMapping("/{id}")
    public Product patch(@PathVariable Long id, @RequestBody Product p) {
        Product existing = repo.findById(id).orElse(null);
        if (existing != null) {
            if (p.getName() != null) existing.setName(p.getName());
            if (p.getPrice() != 0) existing.setPrice(p.getPrice());
            if (p.getQuantity() != 0) existing.setQuantity(p.getQuantity());
            return repo.save(existing);
        }
        return null;
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { repo.deleteById(id); }
}