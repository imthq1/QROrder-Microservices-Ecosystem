package com.example.CalendarService.Repository;

import com.example.CalendarService.Domain.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface ScheduleRepository extends JpaRepository<Schedule, Long>, JpaSpecificationExecutor<Schedule> {
    @Query("""
        SELECT s.type, COUNT(s)
        FROM Schedule s
        WHERE (:from IS NULL OR s.startTime >= :from)
          AND (:to IS NULL OR s.endTime <= :to)
        GROUP BY s.type
    """)
    List<Object[]> countByType(
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to
    );
}
