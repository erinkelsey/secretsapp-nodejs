# Secrets App

Whisper app clone with Node.js, Express and MongoDB.

Hashes passwords stored in database with MD5.

Hosted example:

### Install

    $ npm install

### Setup

Create a .env file in the main folder, containing the connection string for your MongoDB, and a secret key for encrypting the password. For example:

MONGODB_SRV_ADDRESS=mongodb://localhost:27017/userDB

### Run

    $ npm start
