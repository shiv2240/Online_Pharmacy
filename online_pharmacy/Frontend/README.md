# Online Pharmacy - Frontend Focus

## Introduction
The Online Pharmacy platform is a modern, intuitive, and fully responsive e-commerce platform designed for purchasing medicines online. The platform allows users to search for medications, upload prescriptions, track their orders, and make secure purchases. The system integrates advanced search functionality, real-time order tracking, personalized medicine recommendations, and a seamless cart and checkout process.

## Project Type
Frontend | Fullstack

## Deployed App
- Frontend: [Online_Pharmacy-2](https://online-pharmacy-2.netlify.app/)
- Backend: [Online_Pharmacy](https://online-pharmacy-ps8n.onrender.com)
- Database: [MongoDB](mongodb+srv://shivsahni2240:e51j4i1P2qxscoYZ@myplace.moobold.mongodb.net/)

## Directory Structure




## Video Walkthrough of the project
Attach a very short video walkthrough of all of the features [ 1 - 3 minutes ]

## Video Walkthrough of the codebase
Attach a very short video walkthrough of the codebase [ 1 - 5 minutes ]

## Features
- **Searchable Medicine Catalog with Advanced Filters**
  - Real-time search and advanced filters for users to easily find medicines.
- **Responsive and Interactive UI/UX**
  - The platform is designed to be responsive and user-friendly across devices.
- **Prescription Uploads with Validation Feedback**
  - Secure and easy-to-use interface for uploading prescriptions.
- **Personalized Medicine Recommendations**
  - AI-driven recommendations based on user history or symptoms.
- **Order Management with Real-Time Updates**
  - Users can track the status of their orders in real-time.
- **Interactive Shopping Cart & Multi-Step Checkout**
  - Seamless cart and checkout process with progress indicators.

## Design Decisions or Assumptions
- Responsive design using CSS Grid and Flexbox for layout.
- Use of AI for personalized medicine recommendations.
- Implemented drag-and-drop functionality for prescription uploads.
- Real-time order status updates with toast notifications.

## Installation & Getting Started
### Backend
To get the backend up and running, follow these steps:

```bash
cd backend
npm install

Create a .env file and set the required environment variables (e.g., database URL, JWT secret, etc.).

cd frontend
npm install
npm start
Ensure that the backend is running before starting the frontend.

After installing the necessary packages, you can run the application and view it in your browser. The frontend should automatically communicate with the backend.

npm start

Technology Stack
Frontend: React.js, CSS Grid, Flexbox

Backend: Node.js, Express.js, MongoDB, JWT (for authentication)

Libraries: Axios (for API calls), React Router (for routing), React Context (for state management), Material-UI (for UI components)