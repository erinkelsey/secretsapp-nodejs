# Secrets App

Whisper app clone with Node.js, Express and MongoDB.

Hashed and salted passwords stored in database with bcrypt. Salt rounds are set to 10, which should take ~10 seconds. Details: https://www.npmjs.com/package/bcrypt

Hosted example:

### Install

    $ npm install

### Setup

Create a .env file in the main folder, containing the connection string for your MongoDB. For example:

MONGODB_SRV_ADDRESS=mongodb://localhost:27017/userDB

### Run

    $ npm start

### Different Methods for Securing Passwords in Database:

1. Encrypting and Decrypting passwords with mongoose-encryption

2. Hashing passwords with md5

3. Hashing and salting with bcrypt

NOTE: all of these methods are implemented in this project. Check History to see each of the implementations.
