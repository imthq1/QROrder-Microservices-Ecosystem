package com.example.CalendarService.Domain.Res;

import com.example.CalendarService.Domain.Schedule;
import com.example.CalendarService.Util.Enum.ScheduleStatus;
import com.example.CalendarService.Util.Enum.ScheduleType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CalendarDayResponse {
    private LocalDate date;
    private List<CalendarEventResponse> events;
    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class CalendarEventResponse {
        private Long id;
        private String title;
        private String note;
        private String located;
        private ScheduleType type;
        private ScheduleStatus status;
        private LocalDateTime startTime;
        private LocalDateTime endTime;

    }

}
