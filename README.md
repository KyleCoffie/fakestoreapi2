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
*   "@reduxjs/toolkit": "^2.6.1",
*    "@tanstack/react-query": "^5.69.0",
*    "@tanstack/react-query-devtools": "^5.69.0",
*    "axios": "^1.8.4",
*    "firebase": "^11.6.0",
*    "glob": "^11.0.1",
*    "lru-cache": "^11.1.0",
*    "react": "^19.0.0",
*    "react-dom": "^19.0.0",
*    "react-firebase-hooks": "^5.1.1",
*    "react-redux": "^9.2.0",
*    "react-router-dom": "^7.4.1",
*    "react-star-ratings": "^2.3.0",
*    "redux-mock-store": "^1.5.5",
*    "text-encoding": "^0.7.0",
*    "util": "^0.12.5",
*    "uuid": "^11.1.0"
## Unit Testing
I have added testing for the SHoppingCart component. Scefically the remove item button within the cart.
I've also added a test for the Logout function to render the button, call signOut and navigate to Login, displays loading state,and to display a message if logout fails.

