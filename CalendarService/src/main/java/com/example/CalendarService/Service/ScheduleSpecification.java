package com.example.CalendarService.Service;

import com.example.CalendarService.Domain.Schedule;
import com.example.CalendarService.Util.Enum.ScheduleStatus;
import com.example.CalendarService.Util.Enum.ScheduleType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


public class ScheduleSpecification {

    public static Specification<Schedule> filter(
            ScheduleType type,
            ScheduleStatus status,
            LocalDateTime from,
            LocalDateTime to
    ) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (type != null) {
                predicates.add(cb.equal(root.get("type"), type));
            }

            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }

            if (from != null && to != null) {
                predicates.add(
                        cb.between(root.get("startTime"), from, to)
                );
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}