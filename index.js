import express from "express"
import { scrapeLogic } from "./scrapeLogic.js"
const app = express();

const PORT = process.env.PORT || 4000;

let hasRedirected = false; // Add this line

// Middleware function to check if it's Wednesday 15:05 Bulgarian time
const redirectIfWednesday1505 = (req, res, next) => {
  const checkTime = () => {
    const now = new Date();
    // Convert to Bulgarian time
    now.setHours(now.getHours()); // Bulgaria is GMT+3
  
    // Log the current time in Bulgarian time zone
    console.log("Current time in Bulgarian time zone:", now.toLocaleString("bg-BG"));
  
    // Check if it's Wednesday and the time is between 15:00 and 15:14
    if (
      now.getDay() === 3 && // 3 corresponds to Wednesday
      now.getHours() === 15 &&
      now.getMinutes() >= 0 && now.getMinutes() <= 50 &&
      !hasRedirected
    ) {
      // Log a message
      console.log("Redirecting to /scrape...");

      // Redirect to "/scrape"
      res.redirect("/scrape");
      hasRedirected = true; 
    } else {
      console.log("Not redirecting...");
      next();
    }
  };

  // Check every minute
  setInterval(checkTime, 5000);

  // Continue to the next middleware
};

// Apply the middleware to all routes
app.use(redirectIfWednesday1505);



app.get("/scrape", (req, res) => {
  scrapeLogic(res);
});

app.get("/", (req, res) => {

  res.send("Render Puppeteer server is up and running!");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
