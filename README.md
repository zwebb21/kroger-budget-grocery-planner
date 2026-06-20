# Kroger Budget Grocery Planner

A full-stack JavaScript app that uses the Kroger Public API to search nearby Kroger stores, search grocery products by location, and build a grocery list with an estimated total.

## Live Demo

[View Live App](PASTE_YOUR_RENDER_LINK_HERE)

## Features

- Search Kroger stores by ZIP code
- Select a Kroger store location
- Search products by keyword
- View product name, brand, size, price, aisle, and image
- Add products to a grocery list
- Calculate an estimated grocery total
- Save grocery list using localStorage

## Tech Stack

- HTML
- CSS
- JavaScript
- Node.js
- Express
- Kroger Public API
- OAuth 2.0
- dotenv
- localStorage
- Render

## What I Learned

- How to protect API credentials using `.env`
- How to create backend routes with Express
- How OAuth client credentials work
- How to fetch data from a third-party API
- How to clean messy API JSON before sending it to the frontend
- How to use localStorage to save user data
- How to deploy a full-stack Node/Express app with Render

## App Flow

1. User enters a ZIP code.
2. Frontend calls the `/locations` route.
3. Backend gets a Kroger OAuth token.
4. Backend requests nearby Kroger stores.
5. User selects a store.
6. User searches for a product.
7. Frontend calls the `/products-simple` route.
8. Backend gets Kroger product data and cleans the response.
9. Frontend displays product cards.
10. User adds products to a grocery list and sees the estimated total.

## Run Locally

Install dependencies:

```bash
npm install