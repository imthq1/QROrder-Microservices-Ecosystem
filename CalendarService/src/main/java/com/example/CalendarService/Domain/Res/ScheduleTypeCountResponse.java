package com.example.CalendarService.Domain.Res;

import com.example.CalendarService.Util.Enum.ScheduleType;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ScheduleTypeCountResponse {
    private ScheduleType type;
    private Long count;
}