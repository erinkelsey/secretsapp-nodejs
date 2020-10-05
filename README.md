# Secrets App

Whisper app clone with Node.js, Express and MongoDB.

Use Passport.js and passport-local-mongoose to hash and salt passwords stored in MongoDB, and to create cookies and sessions, so that user can stay logged in to site.

Hosted example:

### Install

    $ npm install

### Setup

Create a .env file in the main folder, containing the connection string for your MongoDB and a secret. For example:

    MONGODB_SRV_ADDRESS=mongodb://localhost:27017/userDB
    SECRET_KEY=mysecretkey123

### Run

    $ npm start

### Different Methods for Securing Passwords in Database:

1. Encrypting and Decrypting passwords with mongoose-encryption

2. Hashing passwords with md5

3. Hashing and salting with bcrypt

4. Passport.js and passport-local-mongoose for cookies and sessions

5. OAuth 2.0 and using a 3rd party for checking credentials (such as Google)

NOTE: all of these methods are implemented in this project. Check History to see each of the implementations.

### OAuth

OAuth is an open standard for access delegation, commonly used as a way for Internet users to grant websites or applications access to their information on other websites but without giving them the passwords.

Benefits -> User Can Control:

- Granular Access Levels
- Read/Read+Write Access
- Revoke Access
