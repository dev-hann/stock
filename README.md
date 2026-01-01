# Stock Price Tracking Application

A cross-platform stock price tracking application that provides real-time stock data, historical charts, and detailed company information. Developed using a combination of the `gyo` framework for native Android/iOS experience and Next.js for the web frontend, this application offers a consistent and feature-rich experience across devices.

## ✨ Features

*   **Stock Search:** Easily search for stocks by symbol or company name.
*   **Real-time Stock Details:** View current prices, key metrics, and company profiles.
*   **Interactive Charts:** Visualize historical stock price data with customizable timeframes.
*   **Cross-Platform Experience:** Seamless user experience across Web, Android, and iOS, powered by `gyo`.
*   **Server-Side Data Fetching:** Utilizes Next.js API routes to securely fetch data from Yahoo Finance via `yahoo-finance2`.
*   **Efficient State Management:** Leverages React Query for robust server-state management and React's `useState` for UI state.
*   **Modern Styling:** Built with Tailwind CSS for a clean and responsive design.

## 🚀 Technologies Used

*   **Frontend (Web):** Next.js, React, TypeScript
*   **Cross-Platform (Native):** Gyo Framework (for Android and iOS)
*   **Styling:** Tailwind CSS
*   **State Management:** React Query (`@tanstack/react-query`)
*   **Data Source:** `yahoo-finance2` (via Next.js API Routes)
*   **Build Tools:** npm/yarn, Gradle (Android), Xcode (iOS)

## 🏗️ Architecture

The project follows a clean, layered architecture designed for maintainability and separation of concerns:

*   **`src/app/api`**: Next.js API Routes serve as a backend layer, handling secure data fetching from `yahoo-finance2` and acting as a proxy to avoid CORS issues.
*   **`src/repository`**: The data access layer, responsible for abstracting data sources.
*   **`src/use-cases`**: The business logic layer, orchestrating data flow and preparing it for the UI.
*   **`src/hook`**: Custom React hooks encapsulating complex UI logic, data fetching, and side effects.
*   **`src/components`**: Reusable React components, organized by feature or common utility.

## ⚙️ Getting Started

### Prerequisites

*   Node.js (LTS recommended)
*   npm or yarn
*   Java Development Kit (JDK) (for Android development)
*   Android SDK (for Android development)
*   Xcode (for iOS development on macOS)
*   Gyo Framework CLI (ensure it's installed and configured according to Gyo documentation)

### Installation (Web)

1.  Navigate to the `lib` directory:
    ```bash
    cd lib
    ```
2.  Install frontend dependencies:
    ```bash
    npm install # or yarn install
    ```
3.  Run the development server:
    ```bash
    npm run dev # or yarn dev
    ```
4.  Open your browser and navigate to [http://localhost:3000](http://localhost:3000) to see the web application.

### Installation (Android/iOS)

_Note: The specific commands for building with Gyo may vary. Refer to the Gyo Framework documentation for detailed instructions._

1.  Ensure you are in the project's root directory.
2.  Build for Android:
    ```bash
    gyo build android # (or equivalent command for Gyo)
    ```
3.  Build for iOS (on macOS):
    ```bash
    gyo build ios # (or equivalent command for Gyo)
    ```
4.  Follow the Gyo Framework's instructions to run the application on an emulator/simulator or a physical device.

## 💡 Usage

*   Once the application is running, use the prominent search bar to find stocks by their ticker symbol (e.g., `AAPL`, `GOOGL`) or full company name.
*   Click on any stock in the search results to navigate to its detailed view, where you can explore real-time metrics, company information, and interactive historical price charts.