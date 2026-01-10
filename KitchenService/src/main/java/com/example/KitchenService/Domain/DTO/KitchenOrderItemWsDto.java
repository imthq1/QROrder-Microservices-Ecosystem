package com.example.KitchenService.Domain.DTO;

import com.example.KitchenService.Util.KitchenOrderItemStatus;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class KitchenOrderItemWsDto {
    private Integer id;
    private Integer orderItemId;
    private Integer menuItemId;
    private String menuItemName;
    private Integer quantity;
    private String note;
    private KitchenOrderItemStatus status;
}
