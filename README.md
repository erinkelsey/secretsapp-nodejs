# Secrets App

Whisper app clone with Node.js, Express and MongoDB.

Encrypts and decrypts passwords stored in database with mongoose-encryption package.

Hosted example:

### Install

    $ npm install

### Setup

Create a .env file in the main folder, containing the connection string for your MongoDB, and a secret key for encrypting the password. For example:

MONGODB_SRV_ADDRESS=mongodb://localhost:27017/userDB
SECRET_KEY=mysecretkey123

### Run

    $ npm start
