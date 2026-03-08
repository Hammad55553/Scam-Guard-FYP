# FYP Technical Documentation: AI Scraper Engine (Scam Guard)

This document provides a detailed technical breakdown of the **AI Scraper Engine** project for implementation review and evaluation purposes.

---

## 1. Project Overview
**Scam Guard** is an AI-driven security tool designed to detect fraudulent applications by performing a real-time deep crawl of app store metadata. It uses a combination of **Heuristic Analysis**, **Pattern Recognition**, and **Source Verification** to assign a security integrity score.

---

## 2. Core Architecture & System Flow

1.  **Input Phase**: User provides an App Name and a Play Store URL.
2.  **Crawl Phase**: The engine uses a CORS Proxy (`allorigins`) to fetch the live HTML content of the provided URL.
3.  **Analysis Phase**: 
    *   **Textual Analysis**: Scans for 50+ high-risk and trust-based keywords.
    *   **Source Verification**: Detects official package signatures (e.g., `com.google`).
4.  **Verdict Phase**: Calculates a weighted safety percentage and generates a unique, shareable security report.

---

## 3. Detailed File & Logic Breakdowns

### A. `js/scraper-engine.js` (The Brain)
This is the core logic handler. It contains the `ScraperEngine` object.

*   **Line 19 - 44 (`config`)**: Logic for weighting.
    *   `high_risk_weight: 35`: Penalizes the score if malware or phishing keywords are found.
    *   `trust_bonus: 20`: Rewards the score if security certifications (e.g., GDPR, Encryption) are found.
*   **Line 49 - 58 (`runCrawl`)**: 
    *   Uses `fetch()` with a proxy to bypass browser security (CORS) and read the live code of any website.
*   **Line 117 - 165 (`analyze`)**: 
    *   The **Heuristic Engine**. It loops through the live HTML and computes the `riskScore`.
    *   It uses **Regex (Regular Expressions)** to find patterns without needing a database.

### B. `detect.html` (The Interaction Layer)
This screen handles the user experience and visual feedback.

*   **Line 13 - 150 (Styles)**: Implements **Glassmorphism** using `backdrop-filter: blur(30px)`.
*   **Line 400 - 450 (`renderResults`)**: 
    *   This function hides the input form and injects the AI results into the dashboard.
    *   **Logic**: It generates a `reportId` using `Math.random().toString(36)` to ensure every scan is unique.
*   **Progress Simulation**: Uses a `setInterval` to update the loading bar from 0% to 100%, providing the user with a "High-Tech" scanning feel.

### C. `report.html` (The Security Certificate)
The shareable result page.

*   **Line 123 - 130**: Parses `URLSearchParams`. 
    *   This allows the report to be shared as a link (e.g., `report.html?name=WhatsApp&score=98`) without needing a backend database.
*   **Line 144 - 155**: Conditional Rendering.
    *   If `score >= 50`, it shows the **Green (Safe)** theme.
    *   If `score < 50`, it triggers the **Red (Danger)** theme with a high-intensity warning message.

### D. `index.html` (The Landing Page)
*   Provides the entry point.
*   Features a **Floating Action Button (FAB)** at the bottom right for quick access to the scanner.

---

## 4. Key Technologies Used
*   **Javascript (ES6+)**: For the asynchronous scraping and heuristic logic.
*   **HTML5 Semantic Tags**: For SEO and accessibility.
*   **Vanilla CSS3**: Custom grid layouts, glassmorphism, and keyframe animations.
*   **CORS API Proxy**: To enable client-side web scraping.

---

## 5. Security Heuristics (Logic Table)
| Check Type | Pattern | Weight |
|---|---|---|
| **High Risk** | phish, malware, backdoor, exploit | +35% Risk |
| **Trust Signal** | encryption, verified, ssl, protect | -20% Risk |
| **Official Source** | com.google, com.android | Forced "Safe" |

---

**Developer Note**: This project is built as a **Proof of Concept (PoC)** to demonstrate how AI can be used to identify social engineering and malicious patterns in mobile application distributions.
