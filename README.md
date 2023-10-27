# AdoptifyMe Server 🐶

This repository contains the backend server for a AdoptifyMe application.

AdoptifyMe is a web platform designed to simplify the process of pet adoption from shelters and connecting users with their future furry companions.

## Table of Contents

- [Project Overview](#project-overview)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Error Handling](#error-handling)
- [API Routes](#api-routes)
- [Contributing](#contributing)
- [Authors](#authors)

## Project Overview

The AdoptifyMe Server serves as the backend for the MERN (MongoDB, Express, React, Node.js) stack application. It handles the server-side logic, API endpoints, database interactions, and more.

For the frontend code, please visit the [AdoptifyMe client](https://github.com/MariaG6/AdoptifyMe-client) repository.

[![Frontend Repository](https://img.shields.io/badge/Frontend-Repository-brightgreen.svg)](https://github.com/MariaG6/AdoptifyMe-client)

## Installation

To set up and run Adoptify Server locally, follow these steps:

1. Clone this repository:

   ```bash
   git clone https://github.com/MariaG6/AdoptifyMe-server.git
   ```

2. Navigate to the project directory:

   ```bash
   cd AdoptifyMe-server
   ```

3. Install the required dependencies:

   ```bash
   npm install
   ```

4. Start the server:

   ```bash
   npm run dev
   ```

The server will be accessible at the specified port (default: 3000).

We recommend using [PostMan](https://www.postman.com/downloads/) for testing.

## Project Structure

- `app.js`: The main application file.
- `server.js`: Server setup and configuration.
- `routes/`: Contains route handlers for various API endpoints.
- `models/`: Defines the data models for the application.
- `middleware/`: Custom middleware functions.
- `.gitignore`: Specifies which files and directories should be ignored by Git.
- `package.json` and `package-lock.json`: Contain the project's dependencies.

## Error Handling

The server includes error handling to ensure the application gracefully handles errors and provides appropriate responses to clients.

## API Routes

The server defines various API routes for interacting with the application's data. These routes are located in the `routes/` directory.

## Contributing

If you wish to contribute to this project, please follow these steps:

1. Fork the repository.

2. Create a new branch for your contribution:

   ```bash
   git checkout -b my-contribution
   ```

3. Make your changes, document any new features or modifications, and ensure the application is working correctly.

4. Submit a Pull Request with your changes.

## 🚀 Deployment here! 
👉 [AdoptifyMe](https://adoptifyme.netlify.app/)

## Authors

[Franklin](https://github.com/franklinosei) & [María](https://github.com/MariaG6)

<p align="center"> Thank you for using and contributing to the AdoptifyMe Server! 👋 <p/>
