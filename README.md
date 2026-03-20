# Blood Donation Support System (BDSS)

A full-stack academic system designed to manage blood donation scheduling,
donation workflows, blood inventory, and emergency notifications within
an internal healthcare environment.

---

## Project Overview

The **Blood Donation Support System (BDSS)** aims to support and optimize
the **non-emergency blood donation process** by connecting donors, medical staff,
and healthcare facilities through a centralized platform.

The system focuses on:
- Structured blood donation booking and processing
- Secure user authentication and authorization
- Blood inventory management
- Real-time emergency notifications
- Automated donor eligibility evaluation and reminders

This project is built for **learning and demonstration purposes only**
and is not intended for production use.

---

## Team & Project Context

- **Project Type:** Academic / Training Project  
- **Team Size:** 4 members  
- **Program Context:** University / Training Academy group project  
- **Purpose:** Educational and portfolio demonstration  
- **Deployment:** Not deployed to any production environment  
- **Data:** Sample and mock data only  

This repository represents a **team-based project**.  
I was **not the sole author** of the entire system.

---

## My Responsibilities

In this project, I was responsible for designing and implementing the following key features:

### Blood Donation Workflow
- Implemented the **end-to-end non-emergency blood donation flow**
- Managed appointment booking, donation status tracking, and process lifecycle

### Pre-Donation Survey & Eligibility
- Automatically generated an initial **health survey** when a donor books an appointment
- Evaluated donor eligibility before forwarding the request to medical staff
- Ensured only qualified donors proceed to the donation process

### Blood Inventory Management
- Implemented logic for managing **blood storage and availability**
- Updated inventory based on donation outcomes

### Authentication & Authorization
- Designed secure login and access control using **JWT-based authentication**
- Applied **role-based authorization** on both Back-end and Front-end
- Secured protected APIs and restricted UI navigation based on user roles

### Automated Reminders
- Implemented logic to automatically **notify donors when they are eligible**
  for their next donation cycle

### Emergency Notifications
- Implemented **real-time emergency alerts** for urgent blood requests
  using **WebSocket** technology

### Front-end Integration
- Integrated Back-end APIs with the Front-end using **Axios**
- Built role-based navigation and route protection on the client side
- Ensured secure token handling across the application

---

## Tech Stack Overview

### Back-end
- Java Spring Boot
- Spring Security
- Spring Data JPA / Hibernate
- RESTful APIs
- WebSocket (real-time communication)
- JWT (authentication & authorization)

### Front-end
- ReactJS
- Axios (API communication)
- React Router (navigation & route protection)

### Database & Infrastructure
- Relational Database (academic setup)
- Token-based security using JWT

