# QROrder Microservices Ecosystem

A high-performance, event-driven Microservices system designed for modern smart restaurants. This application enables customers to scan a **table-specific QR code** to browse the menu and place orders, with **real-time updates** on their order status.

---
## System Architecture

<img width="588" height="692" alt="image" src="https://github.com/user-attachments/assets/864507c6-210f-4053-bcc5-4bbf3dd64bcc" />


*Overview of the microservices ecosystem and inter-service communication.*

## System Architecture

The project leverages a cloud-native architecture for high availability and instant responsiveness:

* **API Gateway:** Centralized entry point for routing and load balancing.
* **Service Discovery (Eureka):** Dynamic registration and discovery of microservices.
* **Event-Driven Architecture (Kafka):** De-couples `Order Service` and `Kitchen Service` for reliable message processing.
* **Real-time Updates (WebSocket):** Provides instant notifications to both customers (order status) and staff (new orders) without page reloads.

---
## Customer Experience (Mobile Client)

When a customer scans the QR code at their table, they are directed to a seamless web-based ordering interface.

| Menu Discovery | Shopping Cart & Notes |
| :---: | :---: |
| <img width="375" height="832" alt="image" src="https://github.com/user-attachments/assets/bb56f5a8-df39-4a3a-a5f0-a801285f19bf" /> | <img width="376" height="830" alt="image" src="https://github.com/user-attachments/assets/58c6515c-0c37-433e-b51f-b89909712ea0" /> |
| *Browsing categories and popular dishes.* | *Reviewing items and adding custom notes.* |

---

## Management Dashboards (Admin & Staff)

The administrative suite provides total control over restaurant operations with a real-time, responsive interface.

### Kitchen Monitor (Real-time)
Designed for chefs to manage the cooking queue. Orders appear instantly as they are placed by customers.
<img width="1852" height="984" alt="image" src="https://github.com/user-attachments/assets/bfb5cee4-cbc0-4c3c-937f-85c986c13dab" />

- **Status Tracking:** Mark orders as "Xong" (Done) or "Hủy" (Cancel).
- **Live Sync:** Instant updates across all kitchen displays via **WebSocket**.

### Table & Order Management
A birds-eye view of the restaurant floor and active transactions.
| Table Map | Order Details |
| :---: | :---: |
| <img width="1856" height="983" alt="image" src="https://github.com/user-attachments/assets/ddc2690f-5343-45e1-b766-cb023b0dc442" />| <img width="1853" height="976" alt="image" src="https://github.com/user-attachments/assets/f787420c-4b6d-45ea-b075-6233efd46005" /> |
| *Real-time occupancy and table status.* | *Detailed breakdown of items, notes, and payments.* |

### Internal Scheduling (Calendar Service)
Centralized planning for restaurant activities.
<img width="1860" height="977" alt="image" src="https://github.com/user-attachments/assets/8fd655b2-f080-4117-9d2a-42376672f729" />

- **Event Types:** Manage Meetings, Inventory Checks (Họp kho), Staff Training, and Events.
- **Organization:** Keep the entire staff aligned with a clean, color-coded calendar interface.

---
## Key Features

- **QR-Code Self-Ordering:** Unique QR codes for each table link customers directly to their session.
- **Real-time Kitchen Dashboard:** Chefs receive orders instantly via **WebSocket** and **Kafka**.
- **Live Order Tracking:** Customers receive real-time notifications (e.g., "Cooking", "Ready to Serve") via **WebSocket**.
- **Internal Operations:** Dedicated `Calendar Service` for staff shifts, inventory audits, and restaurant events.
- **Table Management:** Integrated within `Menu Service` to track occupancy and QR assignments.

---

## Microservices Overview

| Service | Primary Responsibility | Tech/Storage |
| :--- | :--- | :--- |
| **Identity Service** | JWT Authentication & User Sessions. | MySQL |
| **Menu Service** | Digital Menu & **Table/QR Code Management**. | MySQL |
| **Order Service** | Transactional logic and order lifecycle. | MySQL |
| **Kitchen Service** | Order preparation workflow & Chef UI. | MySQL, WebSocket |
| **Calendar Service** | Staff scheduling & Inventory audit logs. | MySQL |
| **User Service** | Customer loyalty and profile management. | MySQL |

---

## The Real-Time Workflow

1.  **Scan & Browse:** Customer scans the QR code (`table_id` encoded).
2.  **Order Placement:** `Order Service` saves the order and produces a message to **Kafka**.
3.  **Kitchen Notification:** `Kitchen Service` consumes the Kafka message and pushes a **WebSocket** alert to the Chef's dashboard.
4.  **Status Update:** When the Chef clicks "Prepared", the `Kitchen Service` sends a **WebSocket** notification back to the specific Customer's device.

---

## Tech Stack

* **Backend:** Java Spring Boot, Spring Cloud (Gateway, Eureka).
* **Real-time:** **Spring WebSocket (STOMP)**.
* **Messaging:** **Apache Kafka** (Asynchronous events).
* **Database:** MySQL.
* **Build Tool:** Maven.


##  Author
- **GitHub:** [@imthq1](https://github.com/imthq1)



