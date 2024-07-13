require('dotenv').config();
const nodemailer = require('nodemailer');
const { MongoClient } = require('mongodb');

// Configure Nodemailer with Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_ADDRESS, // Your Gmail address
    pass: process.env.EMAIL_PASSWORD,  // Your Gmail password or app-specific password
  },
});

async function getUsers() {
  try {
    const database = client.db('users'); // Replace with your database name
    const collection = database.collection('test'); // Replace with your collection name
    
    const users = await collection.find().toArray();
    return users.map(user => user.email); // Assuming your user documents have an 'email' field
  } catch (error) {
    console.error('Error fetching user emails from MongoDB:', error);
    return [];
  } finally {
    await client.close();
  }
}

async function sendEmail(weatherData) {
  if (!weatherData) {
    console.error('No weather data available to send.');
    return;
  }

  const userEmails = await getUsers();
  
  if (userEmails.length === 0) {
    console.error('No user emails found.');
    return;
  }

  const weatherInfo = `
    Weather in ${weatherData.name}:
    Temperature: ${weatherData.main.temp} °C
    Description: ${weatherData.weather[0].description}
  `;

  const mailOptions = {
    from: 'your-email@gmail.com',
    to: userEmails.join(','),
    subject: 'Hourly Weather Report',
    text: weatherInfo,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}

module.exports = {
  sendEmail,
};
