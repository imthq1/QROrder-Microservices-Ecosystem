package com.example.CalendarService.Controller;

import com.example.CalendarService.Domain.Res.CalendarDayResponse;
import com.example.CalendarService.Domain.Res.ScheduleTypeCountResponse;
import com.example.CalendarService.Domain.Schedule;
import com.example.CalendarService.Service.ScheduleService;
import com.example.CalendarService.Util.Enum.ScheduleStatus;
import com.example.CalendarService.Util.Enum.ScheduleType;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/calendars")
public class ScheduleController {

    private final ScheduleService scheduleService;
    public ScheduleController(ScheduleService scheduleService) {
        this.scheduleService = scheduleService;
    }
//    @GetMapping
//    public Page<Schedule> getSchedules(
//            @RequestParam(required = false) ScheduleType type,
//            @RequestParam(required = false) ScheduleStatus status,
//            @RequestParam LocalDateTime from,
//            @RequestParam LocalDateTime to,
//            Pageable pageable
//    ) {
//        return scheduleService.getSchedules(type, status, from, to, pageable);
//    }
@GetMapping()
public ResponseEntity<List<CalendarDayResponse>> getCalendar(
        @RequestParam(required = false) ScheduleType type,
        @RequestParam(required = false) ScheduleStatus status,
        @RequestParam LocalDateTime from,
        @RequestParam LocalDateTime to
) {
    return ResponseEntity.ok(
            scheduleService.getCalendarSchedules(type, status, from, to)
    );
}

    @GetMapping("/stats/type")
    public ResponseEntity<List<ScheduleTypeCountResponse>> getTypeStats(
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime from,

            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime to
    ) {
        return ResponseEntity.ok(scheduleService.getScheduleTypeStats(from, to));
    }
    @GetMapping("/{id}")
    public ResponseEntity<Schedule> getDetail(@PathVariable Long id) {
        return ResponseEntity.ok(scheduleService.getById(id));
    }

    @PostMapping
    public ResponseEntity<Schedule> create(@RequestBody Schedule schedule) {
        return ResponseEntity.ok(scheduleService.create(schedule));
    }
}
