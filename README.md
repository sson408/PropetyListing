# Real Estate Management System

## Description
This project is designed to manage and display real estate property listings dynamically. The application includes interactive filtering, image navigation, and pagination for an enhanced user experience.

---

## Features

### **Pagination**
- Each page displays up to **12 properties**.
- Includes **Next** and **Previous** buttons for easy navigation through pages.

### **Filter Options**
- A **Filter Button** at the top opens a detailed filtering modal.
- Filters include options for:
  - Property types
  - Price range
  - Number of bedrooms
  - Number of bathrooms
  - Land area
- The **Regions & Suburbs** button allows users to view and select locations from a simulated dataset.

### **Property Listing**
- Each property includes key details:
  - Street address
  - Price
  - Number of bedrooms and bathrooms
- Images for each property can be navigated using **Previous** and **Next** buttons within a carousel.

### **Dynamic Updates**
- Clicking the **Apply Filter** button dynamically updates the properties displayed on the page without requiring a full page reload.
- The total number of properties and selected filter details are displayed dynamically at the top of the page.

### **Simulated Data**
- The location and property data have been simulated to demonstrate functionality.

---

## How to Run the Application

### **Prerequisites**
- Ensure **IIS Express** is enabled for debugging.

### **Running the Project**
1. Open the solution (`.sln`) file in Visual Studio.
2. Set **IIS Express** as the launch profile in the toolbar.
3. Click the **Run (▶)** button to start the application.
4. The browser will open automatically with the application running.

### **Accessing the Application**
- The home page displays the property listings with pagination.
- Use the **Filter Button** at the top to explore and apply filters.

---

## Design Decisions

### **Blazor Framework**
- Chosen for its seamless client-side and server-side integration, making it easy to build interactive web applications.

### **Pagination**
- Implemented using a combination of server-side filtering and client-side updates to ensure efficient data handling.

### **Filtering Logic**
- Filters are dynamically applied using a combination of Blazor state management and JavaScript interop for real-time updates.

### **Image Navigation**
- A carousel design was used for property images, enabling smooth navigation between multiple images for each property.

### **Simulated Data**
- Locations and properties were simulated to demonstrate the features of the application.

---

## Extra Features

### **Dynamic Filter Details Display**
- Real-time updates to filter details at the top of the page based on user selection.

### **Loading Spinner for Images**
- Each image displays a loading spinner until fully loaded, providing a better user experience.

---
