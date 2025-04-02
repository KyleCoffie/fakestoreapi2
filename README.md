# Fake Store API Client

This project is a simple React application that fetches and displays products from the [Fake Store API](https://fakestoreapi.com/). It demonstrates fetching data, displaying it in a list, filtering by category, and includes a custom star rating component.

## Features

*   Displays a list of products from the Fake Store API.
*   Allows filtering products by category using a dropdown menu.
*   Displays an accurate star rating for each product, reflecting decimal values.
*   Shopping cart functionality (managed with Redux Toolkit).
*   User authentication with Firebase.
*   Create, Update, and Delete products (CRUD operations) in Firestore.
*   Order creation and history tracking.
*   Product rating management.

## Installation and Running
Before running the application, make sure you have a Firebase project set up and have initialized Firestore. You will also need to enable email/password authentication.

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    ```
    (Replace `<repository_url>` with the actual URL of your repository.)
2.  **Navigate to the project directory:**
    ```bash
    cd fakestoreapi
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Set up Firebase:**
    *   Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/).
    *   Enable Email/Password authentication in the Firebase console.
    *   Initialize Firestore in your Firebase project.
    *   Add your Firebase configuration to `src/firebasConfig.ts`.
5.  **Populate Firestore (optional):**
        * Run the app and click the "Populate Firestore" button on the home page to load initial product data.
6.  **Run the development server:**
    ```bash
    npm run dev
    ```
    This will start the development server, and you can view the application in your browser.

## Dependencies
*   React
*   Vite
*   @tanstack/react-query
*   Redux Toolkit
*   react-redux
*   firebase
*   react-firebase-hooks
*   react-router-dom
*   react-star-ratings
