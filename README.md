
# DP World Coding submission by Gopi
Hosted here [link](https://dp-world-coding-challenge.vercel.app/)

## Overview

It allows users to create, update, and view orders along with customer and address details. The application also supports the upload of XML files to pre-fill order details, ensuring a streamlined process for managing orders.

## Tech Stack

- **Frontend:**
  - **Next.js:** A React framework for server-side rendering and static site generation.
  - **React:** A JavaScript library for building user interfaces.
  - **Material UI:** A popular React UI framework for building responsive and visually appealing user interfaces.
  
- **Backend:**
  - **Express.js (through Next.js API Routes):** Lightweight web application framework for Node.js.
  - **Mongoose:** A MongoDB object modeling tool designed to work in an asynchronous environment.

- **Database:**
  - **MongoDB:** NoSQL database for storing orders and customer information.

## Features

- **Order Management:**
  - Create, update, and delete orders.
  - List all orders with pagination support.
  - View detailed order information.
  - Edit order details with validation.
  
- **Customer Management:**
  - List customers who have placed orders.
  
- **XML Upload:**
  - Upload XML files to pre-fill order details on the Create Order page.

## API Endpoints

- **Create a New Order (POST)**
  - `POST /api/orders`
  - Validates and creates a new order in the database.

- **Get Orders List (GET)**
  - `GET /api/orders?page=<page_number>&limit=<items_per_page>`
  - Retrieves a paginated list of orders.

- **Get Order Details (GET)**
  - `GET /api/orders/[referenceNum]`
  - Retrieves the details of a specific order by reference number.

- **Update Order (PUT)**
  - `PUT /api/orders/[referenceNum]`
  - Updates an existing order with new details.

- **Get Customers List (GET)**
  - `GET /api/customers`
  - Retrieves a list of customers.

## MongoDB Schemas

### Order Schema (`models/Order.js`)

```javascript
import mongoose from 'mongoose';

const OrderLineSchema = new mongoose.Schema({
    ItemNum: String,
    ItemDescription: String,
});

const AddressSchema = new mongoose.Schema({
    FullName: String,
    AddressType: String,
    AddressLine1: String,
    AddressLine2: String,
});

const CustomerSchema = new mongoose.Schema({
    CustomerCode: String,
    FirstName: String,
    LastName: String,
    Phone: String,
    Email: String,
});

const OrderSchema = new mongoose.Schema({
    ReferenceNum: { type: String, unique: true },
    CountryCode: String,
    Address: AddressSchema,
    Customer: CustomerSchema,
    OrderLines: [OrderLineSchema],
});

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
```

### Customer Schema (`models/Customer.js`)

```javascript
import mongoose from 'mongoose';

const CustomerSchema = new mongoose.Schema({
    CustomerCode: { type: String, unique: true },
    FirstName: String,
    LastName: String,
    Phone: String,
    Email: String,
});

export default mongoose.models.Customer || mongoose.model('Customer', CustomerSchema);
```

## Pages

- **Home Page (`pages/index.js`):**
  - A landing page with links to download sample XML files and navigate to different sections of the app.
  
- **Orders Listing Page (`pages/orders/index.js`):**
  - Displays a list of all orders in a card format with pagination support. Each card shows the order reference number, customer name, address, and item count.

- **Create Order Page (`pages/orders/create.js`):**
  - A form to create a new order, including adding or removing order line items. Supports XML file upload to pre-fill order details.

- **Edit Order Page (`pages/orders/[referenceNum].js`):**
  - Allows viewing and editing an existing order. The page is divided into sections for customer information, address information, and order lines.

- **Customers Listing Page (`pages/customers/index.js`):**
  - Lists all customers who have placed orders.

## Setup and Running the Project

### Prerequisites

- **Node.js** (v14.x or later)
- **MongoDB** (Local instance or MongoDB Atlas)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/dp-world-coding-challenge/dp-world-coding-challenge.git
   cd dp-world-coding-challenge
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env.local` file in the root directory and add the following environment variables:

   ```bash
   MONGODB_URI=<your_mongodb_connection_string>
   ```

4. **Run the development server:**

   ```bash
   npm run dev
   ```

5. **Access the application:**

   Open your browser and go to `http://localhost:3000`.




