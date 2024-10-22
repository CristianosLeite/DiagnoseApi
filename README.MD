# Diagnose Plancia API

This project is an API for the Diagnose Plancia system. It is built using Node.js and Express, and it connects to a PostgreSQL database using Sequelize.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [License](#license)

## Installation

To install the dependencies, run the following command:

```bash
npm install
```

## Usage

To start the server, run:

```bash
node index.js
```

The server will start on the port specified in the `PORT` environment variable or default to port 4000.

## API Endpoints

### Users

- `GET /api/users` - Get all users
- `POST /api/users` - Create a new user

### Activities

- `GET /api/activities` - Get all activities
- `POST /api/activities` - Create a new activity

### Checklists

- `GET /api/checklists` - Get all checklists
- `POST /api/checklists` - Create a new checklist

### File Upload

- `POST /api/upload` - Upload a file
