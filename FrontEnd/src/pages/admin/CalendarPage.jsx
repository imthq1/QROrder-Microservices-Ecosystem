import React, { useEffect, useState, useMemo } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaPlus,
  FaClock,
  FaMapMarkerAlt,
} from "react-icons/fa";
import {
  getSchedules,
  createSchedule,
} from "../../services/calendar/calendarService";
import "../../styles/calendar-page.css";
import ScheduleModal from "../../components/Admin/calendar/ScheduleModal";
import CalendarStats from "../../components/Admin/calendar/CalendarStats";
const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date()); // Tháng đang xem
  const [selectedDate, setSelectedDate] = useState(new Date()); // Ngày đang chọn (để hiện sidebar)
  const [schedulesMap, setSchedulesMap] = useState({}); // Dữ liệu API đã convert sang Object cho dễ tìm
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fetchCalendarData = async () => {
    setLoading(true);
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const fromDate = new Date(year, month, 1).toISOString().split(".")[0];
    const toDate = new Date(year, month + 1, 0, 23, 59, 59)
      .toISOString()
      .split(".")[0];

    try {
      const data = await getSchedules(fromDate, toDate);

      const map = {};
      data.forEach((item) => {
        // Cắt lấy phần YYYY-MM-DD nếu API trả về full datetime
        const dateKey = item.date.split("T")[0];
        map[dateKey] = item.events;
      });
      setSchedulesMap(map);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendarData();
  }, [currentDate]);

  const handleCreateSchedule = async (formData) => {
    try {
      await createSchedule(formData);

      setIsModalOpen(false);
      fetchCalendarData();
      alert("Tạo lịch trình thành công!");
    } catch (error) {
      alert(`Lỗi: ${error}`);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  // --- LOGIC TÍNH TOÁN GRID LỊCH ---
  const daysInMonth = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({ day: null, dateStr: null });
    }
    for (let i = 1; i <= daysInCurrentMonth; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
      days.push({ day: i, dateStr: dateStr });
    }
    return days;
  }, [currentDate]);

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
    );
  };
  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    );
  };

  const getEventTypeClass = (type) => {
    switch (type) {
      case "MENU_UPDATE":
        return "evt-orange";
      case "EVENT":
        return "evt-black"; // Private Dining
      case "TRAINING":
        return "evt-beige"; // Staff Training
      default:
        return "evt-default";
    }
  };

  // Lấy events của ngày đang chọn (selectedDate) để hiển thị Sidebar
  const selectedDateStr = selectedDate.toISOString().split("T")[0];
  const selectedEvents = schedulesMap[selectedDateStr] || [];

  return (
    <div className="calendar-layout">
      <div className="calendar-main">
        <div className="cal-header">
          <div className="cal-nav">
            <h2>
              {currentDate.toLocaleString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </h2>
            <div className="nav-buttons">
              <button onClick={handlePrevMonth}>
                <FaChevronLeft />
              </button>
              <button onClick={handleNextMonth}>
                <FaChevronRight />
              </button>
            </div>
          </div>
          <div className="cal-actions">
            <div className="view-tabs">
              <button className="active">Month</button>
              <button>Week</button>
              <button>Day</button>
            </div>
            <button className="btn-add-schedule" onClick={handleOpenModal}>
              <FaPlus /> Add Schedule
            </button>
          </div>
        </div>
        <CalendarStats currentDate={currentDate} />
        <div className="cal-grid-header">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="weekday-label">
              {d}
            </div>
          ))}
        </div>

        <div className="cal-grid-body">
          {daysInMonth.map((item, index) => {
            if (!item.day)
              return <div key={index} className="cal-cell empty"></div>;

            const events = schedulesMap[item.dateStr] || [];
            const isSelected = item.dateStr === selectedDateStr;

            return (
              <div
                key={index}
                className={`cal-cell ${isSelected ? "selected" : ""}`}
                onClick={() => setSelectedDate(new Date(item.dateStr))}
              >
                <span className="day-number">{item.day}</span>
                <div className="events-stack">
                  {events.slice(0, 3).map((evt) => (
                    <div
                      key={evt.id}
                      className={`mini-event ${getEventTypeClass(evt.type)}`}
                    >
                      {evt.title}
                    </div>
                  ))}
                  {events.length > 3 && (
                    <span className="more-evt">+{events.length - 3} more</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="calendar-sidebar">
        <div className="sidebar-header">
          <h3>Schedule Details</h3>
        </div>

        <div className="selected-date-info">
          <h4>
            {selectedDate.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </h4>
          <span className="event-count">{selectedEvents.length} events</span>
        </div>

        <div className="event-list">
          {selectedEvents.length > 0 ? (
            selectedEvents.map((evt) => (
              <div className="event-card" key={evt.id}>
                {/* Tag loại sự kiện */}
                <div className={`event-tag ${getEventTypeClass(evt.type)}`}>
                  {evt.type.replace("_", " ")}
                </div>

                {/* Tiêu đề */}
                <h4 className="evt-title">{evt.title}</h4>

                {/* Thông tin giờ & địa điểm */}
                <div className="evt-meta">
                  <div className="meta-row">
                    <FaClock className="icon" />
                    <span>
                      {new Date(evt.startTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      -{" "}
                      {new Date(evt.endTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  {evt.located && (
                    <div className="meta-row">
                      <FaMapMarkerAlt className="icon" />
                      <span>{evt.located}</span>
                    </div>
                  )}
                </div>

                {/* Phần Note mới (Đã bỏ Team) */}
                {evt.note && (
                  <div className="evt-note-box">
                    <span className="note-label">Note:</span>
                    <p className="note-content">{evt.note}</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="empty-schedule"></div>
          )}
        </div>
      </div>
      <ScheduleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleCreateSchedule}
        initialDate={selectedDate}
      />
    </div>
  );
};

export default CalendarPage;
