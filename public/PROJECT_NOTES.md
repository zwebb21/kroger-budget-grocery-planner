# Kroger Budget Grocery Planner

## What this app does
This app lets a user search Kroger stores by ZIP code, search products by store, add products to a grocery list, and calculate an estimated total.

## What I learned
- How to use Express
- How to protect API secrets with .env
- How OAuth client credentials work
- How to fetch data from my backend
- How to clean API data
- How to use localStorage
- How to calculate totals from an array

## App flow
1. User enters ZIP code.
2. Frontend calls /locations.
3. Backend gets Kroger token.
4. Backend gets nearby stores.
5. User selects a store.
6. User searches product.
7. Frontend calls /products-simple.
8. User adds products to list.
9. App calculates grocery total.



## New Notes 06/19/26
# Kroger Budget Grocery Planner

A beginner-friendly full-stack JavaScript app that uses the Kroger Public API to search nearby Kroger stores, search products by store, and build a grocery list with an estimated total.

## Features

- Search Kroger stores by ZIP code
- Select a store location
- Search grocery products by keyword
- View product name, brand, size, price, aisle, and image
- Add products to a grocery list
- Calculate estimated grocery total
- Save grocery list with localStorage

## Tech Stack

- HTML
- CSS
- JavaScript
- Node.js
- Express
- Kroger Public API
- OAuth 2.0 Client Credentials
- dotenv
- localStorage

## What I Learned

- How to protect API credentials with environment variables
- How to create Express backend routes
- How OAuth access tokens work
- How to fetch data from a third-party API
- How to clean messy API JSON into useful frontend data
- How to use localStorage for saved user data
- How to calculate totals from selected products

## App Flow

1. User enters a ZIP code.
2. Frontend calls the `/locations` backend route.
3. Backend gets a Kroger OAuth token.
4. Backend requests nearby Kroger store locations.
5. User selects a store.
6. User searches for a product.
7. Frontend calls the `/products-simple` backend route.
8. Backend gets product data from Kroger and cleans the response.
9. Frontend displays product cards.
10. User adds products to a grocery list and sees the estimated total.

## Setup