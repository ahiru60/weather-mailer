require('dotenv').config();
const axios = require('axios');
const { MongoClient } = require('mongodb');
const nodemailer = require('nodemailer');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// MongoDB Configuration
const uri = process.env.DATABASE_URL; // Replace with your MongoDB connection string
const dbName = 'test'; // Replace with your database name
const collectionName = 'users'; // Replace with your collection name

// OpenWeatherMap API Key
const apiKey = process.env.DATABASE_URL;

// Function to fetch weather data using latitude and longitude
async function fetchWeather(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
}

// Function to get all users from MongoDB
async function getUsers() {
    const client = new MongoClient(uri);
  try {
    await client.connect();
    const database = client.db(dbName);
    const collection = database.collection(collectionName);
    const users = await collection.find().toArray();
    //console.log(users);
    return users;
  } catch (error) {
    console.error('Error fetching user emails from MongoDB:', error);
    return [];
  } finally {
    await client.close();
  }
}

// Function to update user with weather data in MongoDB
async function updateUserWeather(userId, weatherData) {
    const client = new MongoClient(uri);
  try {
    await client.connect();
    const database = client.db(dbName);
    const collection = database.collection(collectionName);
    await collection.updateOne({ _id: userId }, { $set: { weatherData: weatherData } });
  } catch (error) {
    console.error('Error updating user weather data in MongoDB:', error);
  } finally {
    await client.close();
  }
}

// Function to process weather data for all users and update MongoDB
async function processWeatherData() {
  const users = await getUsers();
  for (const user of users) {
    const { latitude, longitude } = user.location;
    const weatherData = await fetchWeather(latitude, longitude);
    if (weatherData) {
      await updateUserWeather(user._id, weatherData);
    }
  }
}

// Configure Nodemailer with Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_ADDRESS, // Your Gmail address
    pass: process.env.EMAIL_PASSWORD,  // Your Gmail password or app-specific password
  },
});

// Function to send weather report emails to all users
async function sendWeatherReports() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});

    const prompt = "Write an friendly and description and insightful plain text weather update email body using these data: "

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  const users = await getUsers();
  for (const user of users) {
    if (user.weatherData) {
      const weatherInfo = `
        User name ${user.name}
        Weather data: ${JSON.stringify(user.weatherData)}
      `;
        const result = await model.generateContent(prompt+weatherInfo);
        const response = await result.response;
        const text = response.text();

      const mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: user.email,
        subject: 'Hourly Weather Report',
        text: text,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
        } else {
          console.log('Email sent:', info.response);
        }
      });
    }
  }
}

// Function to execute the entire workflow
async function execute() {
  await processWeatherData();
  await sendWeatherReports();
}

// Export the functions for use in other modules
module.exports = {
  fetchWeather,
  getUsers,
  updateUserWeather,
  processWeatherData,
  sendWeatherReports,
  execute,
};
