# Shop

## Description

This repository is my pet-project. It was written to study **JavaScript** and **Express.js** framework with **MongoDB** database. It provides [backend API](#endpoints) for online shop.

## Features

- Refresh and Access tokens
- Salt and hash for passwords using bcrypt
- Mocha tests for routes
- File uploads using multer

## Used modules

- [node.js (14.16.0)](https://nodejs.org/)
- [express.js (4.17.1)](https://github.com/expressjs/express)
- [mongoDB (4.0.3)](https://www.mongodb.com/) hosted on [clever-cloud.com](https://clever-cloud.com)
- [mongoose (5.12.13)](https://github.com/Automattic/mongoose)
- [jsonwebtoken (8.5.1)](https://github.com/auth0/node-jsonwebtoken)
- [bcrypt (5.0.1)](https://github.com/kelektiv/node.bcrypt.js)
- [morgan (1.10.0)](https://github.com/expressjs/morgan)
- [multer (1.4.2)](https://github.com/expressjs/multer)
- [body-parser (1.19.0)](https://github.com/expressjs/body-parser)
- [dotenv (10.0.0)](https://github.com/motdotla/dotenv)
- [nodemon (2.0.7)](https://nodemon.io)

## Usage

1. Clone project `git clone https://github.com/VKirbyatev/shop.git`
2. `npm install`
3. Setup .env file ([example](https://github.com/VKirbyatev/shop/blob/develop/.env.example))
4. Run authServer `npm run-script authStart`
5. Run basic server `npm start`

## Endpoints

| Methods | Endpoints               | Description               | Access  |
| ------- | ----------------------- | ------------------------- | ------- |
| POST    | /api/user/signup        | Create an account         | Public  |
| POST    | /api/user/login         | Login                     | Public  |
| POST    | /api/user/refresh-token | Refresh Token             | Public  |
| PUT     | /api/user/{id}          | Update user               | Private |
| DELETE  | /api/user/logout        | Logout                    | Private |
| DELETE  | /api/user/{id}          | Delete account            | Private |
| GET     | /api/products           | Get all products          | Public  |
| POST    | /api/products           | Create product            | Private |
| PUT     | /api/products/{id}      | Update a product          | Private |
| DELETE  | /api/products/{id}      | Delete a product          | Private |
| GET     | /api/cart               | Get cart                  | Private |
| POST    | /api/cart               | Add product in cart       | Private |
| PUT     | /api/cart/{productId}   | Update product's quantity | Private |
| DELETE  | /api/cart/{productId}   | Delete product from cart  | Private |
| DELETE  | /api/cart/{cartId}      | Delete cart               | Private |
| GET     | /api/reviews            | Get all reviews           | Public  |
| POST    | /api/reviews            | Create review             | Private |
| PUT     | /api/reviews/{id}       | Update a review           | Private |
| DELETE  | /api/reviews/{id}       | Delete a review           | Private |
