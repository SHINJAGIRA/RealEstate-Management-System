# Real Estate Property Management Dashboard

A modern, frontend-only Real Estate Property Management Dashboard built with React.js. This application allows property managers to track properties, manage tenants, monitor rent payments, and view analytical reports without needing a backend server. Data is persisted entirely using the browser's `localStorage`.

## Technologies Used
- React.js (Vite)
- React Router (v6)
- Material UI (MUI) & MUI DataGrid
- Recharts (for Dashboard analytics)
- `uuid` (for unique ID generation)
- JavaScript ES6+
- Browser `localStorage` (for data persistence)

## Installation Instructions

1. Clone or download this project.
2. Ensure you have [Node.js](https://nodejs.org) installed.
3. Open a terminal in the project directory.
4. Run `npm install` to install all necessary dependencies.

## How to Run the Project

1. Run `npm run dev` in your terminal.
2. Open the provided local URL (typically `http://localhost:5173`) in your browser.
3. Enjoy managing your virtual properties!

## Main Features
- **Dashboard**: High-level overview of portfolio performance, including occupied/vacant counts, expected vs. collected rent, and dynamic charts.
- **Property Management**: Full CRUD (Create, Read, Update, Delete) functionality for properties, property types, and locations. Features include searching, filtering, and detailed views.
- **Tenant Management**: Manage tenants and assign them to available properties.
- **Rent Payments**: Record payments, track outstanding balances, and view payment histories.
- **Reports**: View tabular data for property inventory, occupancy status, and financial statistics (with CSV export capability).

## Property Status Rules
- **Available**: Property is ready to be rented.
- **Occupied**: Property is currently assigned to a tenant.
- **Reserved**: Property is held for an upcoming tenant.
- **Under Maintenance**: Property is currently being repaired or upgraded.
- **Unavailable**: Property is not available for rent for other reasons.
*Note: When a tenant is assigned to an available property, the property's status automatically changes to **Occupied**.*

## Rent Calculation Rules
- **Expected Monthly Rent**: The sum of the monthly rent values for all **Occupied** properties.
- **Collected Rent**: The sum of all `amountPaid` from recorded rent payments.
- **Outstanding Rent**: The sum of all unpaid `balance` from recorded rent payments (where `balance = rentAmount - amountPaid`).
- **Rent Status (Tenant)**:
  - `Paid`: Tenant has no outstanding balance for the current period.
  - `Partially Paid`: Tenant has paid a portion of the rent, but a balance remains.
  - `Outstanding`: Tenant has paid $0 towards their current rent expectation.

## Mock Data Description
The application initializes with realistic mock data to simulate a live environment:
- **Properties**: 40 properties (apartments, houses, offices, etc.) with various statuses.
- **Property Types**: 7 base property classifications.
- **Locations**: 8 mock locations/districts.
- **Tenants**: 30 tenants pre-assigned to 30 occupied properties.
- **Payments**: 60 historical rent payment records demonstrating paid, partially paid, and outstanding statuses.
*If you need to reset the data, simply clear your browser's `localStorage` for the site and refresh the page.*

## Future Improvements
- Implement a backend server (e.g., Node.js/Express) and an actual database (e.g., PostgreSQL or MongoDB) for cross-device persistence.
- Add user authentication and role-based access control (Admin, Manager, Tenant portal).
- Add image uploading for properties using a cloud storage provider like AWS S3 or Firebase Storage.
- Automate rent generation cycles (automatically adding "pending" payment records on the 1st of every month).
