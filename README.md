# Secrets App

Whisper app clone with Node.js, Express and MongoDB.

Use Passport.js and passport-local-mongoose to hash and salt passwords stored in MongoDB, and to create cookies and sessions, so that user can stay logged in to site.

Use Google OAuth2.0, so that users can register and login with Google Accounts, instead of using app authentication.

Hosted example: https://secretsapp-nodejs.herokuapp.com/

### Install

    $ npm install

### Setup

Create a .env file in the main folder, containing the connection string for your MongoDB and a secret. For example:

    MONGODB_SRV_ADDRESS=mongodb://localhost:27017/userDB
    SECRET_KEY=mysecretkey123
    GOOGLE_OAUTH_CLIENT_ID=clientid
    GOOGLE_OAUTH_CLIENT_SECRET=clientsecret
    GOOGLE_OAUTH_CALLBACK_URL=http://localhost:3000/auth/google/secrets

### Run

    $ npm start

## Different Methods for Securing Passwords in Database:

1. Encrypting and Decrypting passwords with mongoose-encryption

2. Hashing passwords with md5

3. Hashing and salting with bcrypt

4. Passport.js and passport-local-mongoose for cookies and sessions

5. OAuth 2.0 and using a 3rd party for checking credentials (such as Google)

NOTE: all of these methods are implemented in this project. Check History to see each of the implementations.

## OAuth

OAuth is an open standard for access delegation, commonly used as a way for Internet users to grant websites or applications access to their information on other websites but without giving them the passwords.

Benefits -> User Can Control:

- Granular Access Levels
- Read/Read+Write Access
- Revoke Access

Steps:

1. Set up your app with the 3rd party
2. Your app will redirect to the 3rd party site to authenticate
3. User logs in via the 3rd party site
4. User grants permission for your app to use their information contained on the 3rd party site
5. Your app will receive an authorization code back
6. Exchange the authorization code for an access token, which can be saved in your database. This token can be used to access the user's information on the 3rd party site.

### Set up Google OAuth

1. Go to Google Developer Console: https://console.developers.google.com/
2. Add a new project, and go to the new project
3. Go to the OAuth Consent Screen page and select External for User Type
4. Fill out Application Name and Authorized Domain on the OAuth consent screen and click Save
5. Go to Credentials, click on Create Credentials and select the OAuth Client ID option
6. On the OAuth Client ID screen, fill out the following:
   Application Type: Web Application
   Name: [Your_App_Name]
   Authorized JavaScript origins URIs: http://localhost:3000 (for testing locally, else add your custom domain)
   Authorized redirect URIs: http://localhost:3000/auth/google/secrets (for testing locally, else add your custom domain, but be sure to keep /auth/google/secrets at the end). This needs to be added to the .env file as GOOGLE_OAUTH_CALLBACK_URL.
7. Save Your Client ID and Your Client Secret in the .env file as GOOGLE_OAUTH_CLIENT_ID and GOOGLE_OAUTH_CLIENT_SECRET
