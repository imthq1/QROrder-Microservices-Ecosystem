package com.example.CalendarService.Service;

import com.example.CalendarService.Domain.Res.CalendarDayResponse;
import com.example.CalendarService.Domain.Res.ScheduleTypeCountResponse;
import com.example.CalendarService.Domain.Schedule;
import com.example.CalendarService.Repository.ScheduleRepository;
import com.example.CalendarService.Util.Enum.ScheduleStatus;
import com.example.CalendarService.Util.Enum.ScheduleType;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.toList;

@Service
@RequiredArgsConstructor
public class ScheduleService {

    private final ScheduleRepository scheduleRepository;

    public Page<Schedule> getSchedules(
            ScheduleType type,
            ScheduleStatus status,
            LocalDateTime from,
            LocalDateTime to,
            Pageable pageable
    ) {
        Specification<Schedule> spec =
                ScheduleSpecification.filter(type, status, from, to);

        return scheduleRepository.findAll(spec, pageable);
    }
    public List<CalendarDayResponse> getCalendarSchedules(
            ScheduleType type,
            ScheduleStatus status,
            LocalDateTime from,
            LocalDateTime to
    ) {
        Specification<Schedule> spec =
                ScheduleSpecification.filter(type, status, from, to);

        List<Schedule> schedules = scheduleRepository.findAll(spec);

        // 1. Map entity -> event response
        List<CalendarDayResponse.CalendarEventResponse> events = schedules.stream()
                .map(this::toCalendarEventResponse)
                .toList();

        // 2. Group theo ngày
        Map<LocalDate, List<CalendarDayResponse.CalendarEventResponse>> grouped =
                events.stream()
                        .collect(Collectors.groupingBy(
                                e -> e.getStartTime().toLocalDate()
                        ));

        // 3. Convert sang CalendarDayResponse
        return grouped.entrySet()
                .stream()
                .map(entry -> new CalendarDayResponse(
                        entry.getKey(),
                        entry.getValue()
                ))
                .sorted(Comparator.comparing(CalendarDayResponse::getDate))
                .toList();
    }
    private CalendarDayResponse.CalendarEventResponse toCalendarEventResponse(Schedule schedule) {
        return new CalendarDayResponse.CalendarEventResponse(
                schedule.getId(),
                schedule.getTitle(),
                schedule.getNote(),
                schedule.getLocation(),
                schedule.getType(),
                schedule.getStatus(),
                schedule.getStartTime(),
                schedule.getEndTime()
        );
    }
    public List<ScheduleTypeCountResponse> getScheduleTypeStats(
            LocalDateTime from,
            LocalDateTime to
    ) {
        List<Object[]> rows = scheduleRepository.countByType(from, to);

        Map<ScheduleType, Long> map = rows.stream()
                .collect(Collectors.toMap(
                        r -> (ScheduleType) r[0],
                        r -> (Long) r[1]
                ));

        return Arrays.stream(ScheduleType.values())
                .map(type -> new ScheduleTypeCountResponse(
                        type,
                        map.getOrDefault(type, 0L)
                ))
                .toList();
    }
    public Schedule create(Schedule schedule) {
        return scheduleRepository.save(schedule);
    }

    public Schedule getById(Long id) {
        return scheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Schedule not found"));
    }
}