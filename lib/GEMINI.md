# Gemini Code Companion: Project Documentation

This document provides a comprehensive overview of the project's architecture, conventions, and key characteristics to guide future development.

## 1. Architecture and Layers

The project follows a clean, layered architecture designed for maintainability and separation of concerns. Each directory in the `src` folder has a distinct responsibility.

-   **`src/app`**: Contains the main application entry point, global styles, and layout components, following Next.js conventions.
-   **`src/components`**: Houses all React components, organized by feature (`search`, `stock-detail`) or common reusability (`common`).
    -   **`components/common`**: A dedicated space for generic, reusable components like spinners, error messages, and message views.
-   **`src/constants`**: Stores application-wide constants, such as query keys for React Query, to ensure consistency.
-   **`src/domain`**: Defines the core data structures and types of the application (e.g., `Stock`, `StockDetail`, `TimeSeriesDataPoint`).
-   **`src/hook`**: Contains custom React hooks that encapsulate complex logic, such as data fetching, state management, and side effects.
-   **`src/provider`**: Includes providers for React context, such as the `ReactQueryProvider` for server-state management.
-   **`src/repository`**: The data access layer, responsible for fetching data from external sources. It defines a generic `StockRepository` interface and a concrete implementation (`ApiRouteStockImplement`) that calls internal API routes.
-   **`src/service`**: Contains services that interact with external APIs. The `ApiClient` provides a generic `fetch` wrapper for various API integrations.
-   **`src/app/api`**: Next.js API Routes that serve as a backend layer, using the `yahoo-finance2` library to fetch data from Yahoo Finance. This architecture keeps the unofficial API calls on the server side, avoiding browser CORS issues.
-   **`src/use-cases`**: The business logic layer, which orchestrates data from repositories to provide a clean API for the UI (hooks).

## 2. State Management

-   **Server State**: The application uses **React Query** (`@tanstack/react-query`) to manage server state, including caching, re-fetching, and handling loading/error states for API-driven data.
-   **UI State**: Local component state is managed with **React's built-in `useState` hook**.

## 3. Data Flow

The data flow is unidirectional, ensuring predictability and ease of debugging:

1.  **UI Event**: A user interaction in a component (e.g., typing in the search bar) triggers a function.
2.  **Hook**: The event handler calls a function from a custom hook (e.g., `useStockSearch`).
3.  **Use Case**: The hook's logic is delegated to a use case (e.g., `stockUseCase.search()`).
4.  **Repository**: The use case calls a method in the repository (e.g., `repository.search()`).
5.  **API Route**: The repository calls an internal Next.js API route (e.g., `/api/stock/search`).
6.  **Yahoo Finance**: The API route uses the `yahoo-finance2` library to fetch data from Yahoo Finance.
6.  **React Query**: The data is fetched and managed by React Query, which updates the component's state with the new data, loading status, or error.
8.  **UI Update**: The component re-renders to display the new data.

## 4. Styling

-   **Tailwind CSS**: The project uses Tailwind CSS for utility-first styling. Global styles and Tailwind configurations are located in `src/app/globals.css` and `tailwind.config.ts`, respectively.

## 5. Coding Conventions

-   **File/Folder Naming**: `kebab-case` (e.g., `stock-detail`, `api-client`).
-   **Component Naming**: `PascalCase` (e.g., `StockChart`, `SearchInput`).
-   **Hook Naming**: `useCamelCase` (e.g., `useStockDetail`, `useDebounce`).
-   **Constants for Query Keys**: All React Query keys are centralized in `src/constants/query-keys.ts` to prevent typos and ensure consistency.

## 6. Component Reusability and Refactoring

To improve code quality and maintainability, the following refactoring has been performed:

-   **Duplicated Views**: Loading and error message displays were duplicated across several components (`StockDetailView`, `StockChart`).
-   **Solution**:
    1.  A generic `MessageView` component was created in `src/components/common` to provide a consistent container for messages.
    2.  `LoadingView` and `ErrorView` components were refactored to use `MessageView`, and they now accept a `className` prop to allow for flexible styling (e.g., adjusting height).
    3.  The loading and error states in `StockDetailView` and `StockChart` were updated to use these new, reusable components.

This change not only reduces code duplication but also ensures a consistent user experience for loading and error states throughout the application.

## 7. API Architecture with yahoo-finance2

The application uses a hybrid architecture to leverage the `yahoo-finance2` library while maintaining clean separation of concerns:

-   **Why yahoo-finance2**: Provides comprehensive financial data from Yahoo Finance, including stock quotes, company profiles, historical data, and financial metrics—all completely free with no API key required.
-   **API Routes Pattern**: Since `yahoo-finance2` cannot run in the browser due to CORS restrictions, we use Next.js API Routes (`/api/stock/*`) as a backend layer.
-   **Benefits**:
    1.  **No Rate Limits**: Unlike other APIs (Polygon.io has 5 calls/min, Finnhub requires paid tier for charts), Yahoo Finance has no hard rate limits.
    2.  **Rich Data**: Access to detailed financial information including PE ratios, EPS, dividends, profit margins, and more.
    3.  **No API Keys**: No authentication required, simplifying deployment and removing security concerns.
    4.  **Server-Side Only**: By using API Routes, we keep the unofficial API calls on the server, avoiding browser CORS issues and maintaining a clean client-side architecture.
-   **Caching Strategy**: API routes implement HTTP caching headers (`Cache-Control`) to reduce redundant requests to Yahoo Finance and improve performance.
