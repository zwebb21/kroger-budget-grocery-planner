const express = require("express");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

//4th add 
app.use(express.static("public"));



// Certification URL because your Kroger app works in Certification
const KROGER_BASE_URL = "https://api-ce.kroger.com/v1";

async function getKrogerToken() {
  const clientId = process.env.KROGER_CLIENT_ID?.trim();
  const clientSecret = process.env.KROGER_CLIENT_SECRET?.trim();

  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const response = await fetch(`${KROGER_BASE_URL}/connect/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${basicAuth}`,
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      scope: "product.compact",
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.log("Kroger token error:", data);
    throw new Error("Failed to get Kroger token");
  }

  return data.access_token;
}

app.get("/", (req, res) => {
  res.send("Kroger practice server is running.");
});

app.get("/test-token", async (req, res) => {
  try {
    const token = await getKrogerToken();

    res.json({
      success: true,
      message: "Kroger token received successfully",
      tokenPreview: token.slice(0, 25) + "...",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// NEW ROUTE: Find Kroger stores near a ZIP code
app.get("/locations", async (req, res) => {
  try {
    const zip = req.query.zip || "77099";
    const token = await getKrogerToken();

    const url = new URL(`${KROGER_BASE_URL}/locations`);
    url.searchParams.set("filter.zipCode.near", zip);
    url.searchParams.set("filter.radiusInMiles", "10");
    url.searchParams.set("filter.limit", "5");

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


app.get("/products", async (req, res) => {
    try {
      const term = req.query.term || "milk";
      const locationId = req.query.locationId;
  
      if (!locationId) {
        return res.status(400).json({
          success: false,
          message: "locationId is required. Example: /products?term=milk&locationId=03400347",
        });
      }
  
      const token = await getKrogerToken();
  
      const url = new URL(`${KROGER_BASE_URL}/products`);
      url.searchParams.set("filter.term", term);
      url.searchParams.set("filter.locationId", locationId);
      url.searchParams.set("filter.limit", "10");
  
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const data = await response.json();
  
      res.status(response.status).json(data);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  });

//


//secon add
app.get("/products-simple", async (req, res) => {
    try {
      const term = req.query.term || "milk";
      const locationId = req.query.locationId;
  
      if (!locationId) {
        return res.status(400).json({
          success: false,
          message: "locationId is required. Example: /products-simple?term=milk&locationId=03400347",
        });
      }
  
      const token = await getKrogerToken();
  
      const url = new URL(`${KROGER_BASE_URL}/products`);
      url.searchParams.set("filter.term", term);
      url.searchParams.set("filter.locationId", locationId);
      url.searchParams.set("filter.limit", "10");
  
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const data = await response.json();
  
      const cleanedProducts = data.data.map((product) => {
        const firstItem = product.items?.[0];
  
        return {
          productId: product.productId,
          name: product.description,
          brand: product.brand,
          size: firstItem?.size || "No size listed",
          price: firstItem?.price?.regular || "No price listed",
          aisle: product.aisleLocations?.[0]?.description || "No aisle listed",
          image: product.images?.[0]?.sizes?.[0]?.url || "No image listed",
        };
      });
  
      res.json({
        success: true,
        searchTerm: term,
        locationId: locationId,
        count: cleanedProducts.length,
        products: cleanedProducts,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  });
//
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});