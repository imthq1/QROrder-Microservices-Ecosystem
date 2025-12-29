package com.example.MenuService.Service;


import com.example.MenuService.Domain.Category;
import com.example.MenuService.Domain.Item;
import com.example.MenuService.Domain.ResDTO.ItemRequest;
import com.example.MenuService.Domain.ResDTO.ItemResponse;
import com.example.MenuService.Repository.CategoryRepository;
import com.example.MenuService.Repository.ItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ItemService {

    private final ItemRepository itemRepository;
    private final CategoryRepository categoryRepository;

    @Transactional
    public ItemResponse createItem(ItemRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + request.getCategoryId()));

        Item item = new Item();
        item.setName(request.getName());
        item.setDescription(request.getDescription());
        item.setPrice(request.getPrice());
        item.setThumbnail_url(request.getThumbnailUrl());
        item.setCategory(category);

        Item savedItem = itemRepository.save(item);
        return mapToResponse(savedItem);
    }

    @Transactional
    public ItemResponse updateItem(int id, ItemRequest request) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found with id: " + id));

        if (request.getCategoryId() != item.getCategory().getId()) {
            Category newCategory = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found with id: " + request.getCategoryId()));
            item.setCategory(newCategory);
        }

        item.setName(request.getName());
        item.setDescription(request.getDescription());
        item.setPrice(request.getPrice());
        item.setThumbnail_url(request.getThumbnailUrl());
        item.setAvailable(request.isAvailable());

        Item updatedItem = itemRepository.save(item);
        return mapToResponse(updatedItem);
    }

    @Transactional(readOnly = true)
    public ItemResponse getItemById(int id) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found with id: " + id));
        return mapToResponse(item);
    }

    @Transactional(readOnly = true)
    public List<ItemResponse> getAllItems() {
        List<Item> items = itemRepository.findAll();
        return items.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ItemResponse> getAvailableItems() {
        List<Item> items = itemRepository.findByIsAvailableTrue();
        return items.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ItemResponse> getItemsByCategory(int categoryId) {
        List<Item> items = itemRepository.findByCategoryId(categoryId);
        return items.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ItemResponse> searchItems(String keyword) {
        List<Item> items = itemRepository.searchByName(keyword);
        return items.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteItem(int id) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found with id: " + id));
        itemRepository.delete(item);
    }

    @Transactional
    public ItemResponse toggleAvailability(int id) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found with id: " + id));
        item.setAvailable(!item.isAvailable());
        Item updatedItem = itemRepository.save(item);
        return mapToResponse(updatedItem);
    }

    private ItemResponse mapToResponse(Item item) {
        ItemResponse response = new ItemResponse();
        response.setId(item.getId());
        response.setName(item.getName());
        response.setDescription(item.getDescription());
        response.setPrice(item.getPrice());
        response.setThumbnailUrl(item.getThumbnail_url());
        response.setAvailable(item.isAvailable());
        response.setCreatedAt(item.getCreated_at());

        if (item.getCategory() != null) {
            response.setCategoryId(item.getCategory().getId());
            response.setCategoryName(item.getCategory().getName());
        }

        return response;
    }
}