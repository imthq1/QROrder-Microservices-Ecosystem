# Smart Restaurant - QR-Based Self-Ordering System

A high-performance, event-driven Microservices system designed for modern smart restaurants. This application enables customers to scan a **table-specific QR code** to browse the menu and place orders, with **real-time updates** on their order status.

---
## System Architecture

<img width="658" height="796" alt="image" src="https://github.com/user-attachments/assets/d12a8656-701e-47bf-821f-946dd8a4e585" />

*Overview of the microservices ecosystem and inter-service communication.*

## System Architecture

The project leverages a cloud-native architecture for high availability and instant responsiveness:

* **API Gateway:** Centralized entry point for routing and load balancing.
* **Service Discovery (Eureka):** Dynamic registration and discovery of microservices.
* **Event-Driven Architecture (Kafka):** De-couples `Order Service` and `Kitchen Service` for reliable message processing.
* **Real-time Updates (WebSocket):** Provides instant notifications to both customers (order status) and staff (new orders) without page reloads.

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
| **Identity Service** | RBAC, JWT Authentication & User Sessions. | MySQL |
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
