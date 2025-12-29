package com.example.MenuService.Controller;

import com.example.MenuService.Domain.ResDTO.ItemRequest;
import com.example.MenuService.Domain.ResDTO.ItemResponse;
import com.example.MenuService.Service.ItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/items")
@RequiredArgsConstructor
public class ItemController {

    private final ItemService itemService;

    @PostMapping
    public ResponseEntity<ItemResponse> createItem(@RequestBody ItemRequest request) {
        ItemResponse response = itemService.createItem(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ItemResponse> updateItem(
            @PathVariable int id,
            @RequestBody ItemRequest request) {
        ItemResponse response = itemService.updateItem(id, request);
        System.out.println("Item"+request.isAvailable());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ItemResponse> getItemById(@PathVariable int id) {
        ItemResponse response = itemService.getItemById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<ItemResponse>> getAllItems(
            @RequestParam(required = false) Integer categoryId,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "false") boolean availableOnly) {

        if (search != null && !search.isEmpty()) {
            return ResponseEntity.ok(itemService.searchItems(search));
        }

        if (categoryId != null) {
            return ResponseEntity.ok(itemService.getItemsByCategory(categoryId));
        }

        if (availableOnly) {
            return ResponseEntity.ok(itemService.getAvailableItems());
        }

        return ResponseEntity.ok(itemService.getAllItems());
    }

    @PatchMapping("/{id}/toggle-availability")
    public ResponseEntity<ItemResponse> toggleAvailability(@PathVariable int id) {
        ItemResponse response = itemService.toggleAvailability(id);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable int id) {
        itemService.deleteItem(id);
        return ResponseEntity.noContent().build();
    }
}