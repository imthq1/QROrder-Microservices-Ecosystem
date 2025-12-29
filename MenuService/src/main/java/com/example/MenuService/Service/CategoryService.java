package com.example.MenuService.Service;

import com.example.MenuService.Domain.Category;
import com.example.MenuService.Domain.Item;

import com.example.MenuService.Domain.ReqDTO.CategoryRequest;
import com.example.MenuService.Domain.ResDTO.CategoryResponse;
import com.example.MenuService.Domain.ResDTO.ItemResponse;
import com.example.MenuService.Repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    @Transactional
    public CategoryResponse createCategory(CategoryRequest request) {
        Category category = new Category();
        category.setName(request.getName());
        category.setDescription(request.getDescription());
        category.setDisplay_order(request.getDisplayOrder());
        category.setItems(new ArrayList<>());

        Category savedCategory = categoryRepository.save(category);
        return mapToResponse(savedCategory, false);
    }

    @Transactional
    public CategoryResponse updateCategory(int id, CategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));

        category.setName(request.getName());
        category.setDescription(request.getDescription());
        category.setDisplay_order(request.getDisplayOrder());

        Category updatedCategory = categoryRepository.save(category);
        return mapToResponse(updatedCategory, false);
    }

    @Transactional(readOnly = true)
    public CategoryResponse getCategoryById(int id, boolean includeItems) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
        return mapToResponse(category, includeItems);
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> getAllCategories(boolean includeItems) {
        List<Category> categories = categoryRepository.findAllByOrderByDisplay_orderAsc();
        return categories.stream()
                .map(category -> mapToResponse(category, includeItems))
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteCategory(int id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
        categoryRepository.delete(category);
    }

    private CategoryResponse mapToResponse(Category category, boolean includeItems) {
        CategoryResponse response = new CategoryResponse();
        response.setId(category.getId());
        response.setName(category.getName());
        response.setDescription(category.getDescription());
        response.setDisplayOrder(category.getDisplay_order());

        if (includeItems && category.getItems() != null) {
            List<ItemResponse> itemResponses = category.getItems().stream()
                    .map(this::mapItemToResponse)
                    .collect(Collectors.toList());
            response.setItems(itemResponses);
        }

        return response;
    }

    private ItemResponse mapItemToResponse(Item item) {
        ItemResponse response = new ItemResponse();
        response.setId(item.getId());
        response.setName(item.getName());
        response.setDescription(item.getDescription());
        response.setPrice(item.getPrice());
        response.setThumbnailUrl(item.getThumbnail_url());
        response.setCreatedAt(item.getCreated_at());
        return response;
    }
}