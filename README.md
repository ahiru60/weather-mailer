# Weather Mailer

Weather Mailer is a Node.js application that fetches weather data for users based on their location and sends them hourly weather updates via email. The application uses MongoDB for storing user data and the OpenWeatherMap API for fetching weather data.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Introduction

Weather Mailer is designed to keep users informed about the weather in their location by sending them regular email updates. The application fetches weather data from the OpenWeatherMap API and sends it to the users via email using Nodemailer.

## Features

- Fetches weather data using latitude and longitude.
- Stores user information and location in MongoDB.
- Sends hourly weather updates via email.
- REST API for managing users.

## Installation

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [npm](https://www.npmjs.com/)

### Steps

1. Clone the repository:
    ```sh
    git clone https://github.com/ahiru60/weather-mailer.git
    cd weather-mailer
    ```

2. Install the dependencies:
    ```sh
    npm install
    ```

3. Set up the environment variables:
    Create a `.env` file in the root directory and add your environment variables. Example:
    ```env
    DATABASE_URL=your_mongodb_connection_string
    OPENWEATHER_API_KEY=your_openweathermap_api_key
    EMAIL_ADDRESS=your_email_address
    EMAIL_PASSWORD=your_email_password
    ```

4. Start the application:
    ```sh
    npm devStart
    ```

## Usage

1. Start the server:
    ```sh
    npm start
    ```

2. Use the API endpoints to manage users and fetch weather data.

## API Endpoints

### Get All Users

```http
GET [/users](http://localhost:3000/users/)
```
### Create User
```http
POST [/users](http://localhost:3000/users/)](http://localhost:3000/users/)
```
## Postman collection - https://documenter.getpostman.com/view/24448852/2sA3e5f8uY
