# Employee Payroll Management System (EPMS)

A full-stack web application for managing employee payroll at SmartPark company.

## Project Structure

- `backend-project/`: Node.js backend with Express and MySQL
- `frontend-project/`: React frontend with TypeScript and Material-UI

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v8 or higher)
- npm (comes with Node.js)

## Setup Instructions

### Database Setup

1. Install MySQL if you haven't already
2. Create a new database and tables:
   ```sql
   mysql -u root -p < backend-project/src/database/schema.sql
   ```

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend-project
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following content:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=epms_db
   JWT_SECRET=your-secret-key
   PORT=5000
   ```

4. Start the backend server:
   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend-project
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm start
   ```

The application will be available at http://localhost:3000

## Features

- Employee Management
  - View all employees
  - Add new employees
  - Update employee information
  - Delete employees

- Department Management
  - View all departments
  - Add new departments
  - Update department information
  - Delete departments

- Salary Management
  - View all salary records
  - Add new salary records
  - Update salary information
  - Delete salary records

## Technologies Used

### Backend
- Node.js
- Express
- MySQL
- TypeScript
- cors
- dotenv

### Frontend
- React
- TypeScript
- Material-UI
- axios
- react-router-dom 