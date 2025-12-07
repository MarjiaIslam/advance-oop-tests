package com.example.demo; // <--- This matches your folder now

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*") 
public class ProductController {

    @Autowired
    private ProductRepository repo;

    @GetMapping
    public List<Product> getAll() {
        return repo.findAll();
    }

    @GetMapping("/{id}")
    public Product getOne(@PathVariable Long id) {
        return repo.findById(id).orElse(null);
    }

    @PostMapping
    public Product create(@RequestBody Product product) {
        return repo.save(product);
    }

    @PutMapping("/{id}")
    public Product update(@PathVariable Long id, @RequestBody Product details) {
        Product p = repo.findById(id).orElseThrow();
        p.setName(details.getName());
        p.setPrice(details.getPrice());
        p.setQuantity(details.getQuantity());
        return repo.save(p);
    }

    @PatchMapping("/{id}")
    public Product patch(@PathVariable Long id, @RequestBody Product details) {
        Product p = repo.findById(id).orElseThrow();
        if(details.getName() != null) p.setName(details.getName());
        if(details.getPrice() != null) p.setPrice(details.getPrice());
        if(details.getQuantity() != null) p.setQuantity(details.getQuantity());
        return repo.save(p);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repo.deleteById(id);
    }
}