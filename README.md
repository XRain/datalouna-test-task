# Test task for DataLouna Node.js Developer position

This is the small full-stack web application that demonstrates integration with the Skinport API and implements a custom marketplace example for CS:GO skins. This project was created as a technical assessment for a job application.

## Features

- **User Authentication**
  - User registration and login
  - Session-based authentication
  - Secure password hashing

- **Skinport Integration**
  - Real-time fetching of items from Skinport API
  - Display of both tradable and non-tradable items
  - Price comparison between tradable and non-tradable versions
  - Redis caching for improved performance

- **Custom Marketplace**
  - Local marketplace with custom items
  - Purchase functionality with transaction management
  - Real-time balance updates
  - Stock management

## Tech Stack

- **Frontend**
  - HTML5
  - CSS3
  - Vanilla JavaScript

- **Backend**
  - Node.js
  - Express.js
  - TypeScript
  - PostgreSQL
  - Redis

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- Redis
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/XRain/datalouna-test-task.git
```

2. Install dependencies:
```bash
npm install
```
3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Set up your environment variables in `.env`:
```
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
REDIS_URL=redis://localhost:6379
SESSION_SECRET=your_session_secret 
```

5. Set up the database:
```bash
psql -U postgres -f schema.sql
psql -U postgres -f seed.sql 
```

## Contributing

This is a test project for a job application, but suggestions and improvements are welcome. Please feel free to fork the repository and submit pull requests.

## Author

Vladislav K

## Acknowledgments

- Skinport API for providing the game items data
- The open-source community for the tools and libraries used in this project 


## Project Structure
```
├── public/
│   ├── index.html
│   ├── app.js
│   └── styles.css
├── src/
│   ├── services/
│   │   ├── itemsService.ts
│   │   └── userService.ts
│   ├── redis/
│   │   └── index.ts
│   ├── types.ts
│   └── index.ts
├── schema.sql
├── seed.sql
├── .env.example
└── package.json
```
