# Backoffice Pro

Backoffice Pro is a modern, single-page application built with Angular for managing users and settings in a back-office environment. It features a clean, responsive interface with a dashboard, user management, and a secure authentication system.

## Features

- **User Authentication**: Secure login and signup functionality.
- **Dashboard**: A central hub for navigating the application.
- **User Management**: View a list of users and edit their details.
- **Reactive Forms**: Modern, editable forms for user data.
- **Client-Side Routing**: Seamless navigation between pages.

## Tech Stack

- **Frontend**: Angular, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express
- **Testing**: Vitest

## Getting Started

### Prerequisites

- Node.js and npm
- Angular CLI

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/mi-lazic-levi9-com/Backoffice-Pro.git
    cd Backoffice-Pro
    ```

2.  **Install frontend dependencies:**

    ```bash
    npm install
    ```

3.  **Install backend dependencies:**
    ```bash
    cd backend
    npm install
    cd ..
    ```

### Running the Application

1.  **Start the backend server:**

    ```bash
    npm start --prefix backend
    ```

    The backend will be running on `http://localhost:3000`.

2.  **Start the frontend development server:**
    ```bash
    npm start
    ```
    The frontend will be running on `http://localhost:4200`.

## Available Scripts

- `npm start`: Starts the frontend development server.
- `npm run build`: Builds the application for production.
- `npm test`: Runs unit tests.
- `npm start --prefix backend`: Starts the backend server.
