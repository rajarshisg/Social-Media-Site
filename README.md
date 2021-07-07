# Connecti : A Social Media Website

Connecti is a full stack Social Media Website created using Express.JS. It is the one stop destination to connect with your friends and family. 


## Visit the official website!

Visit the Connecti website from this link : [http://connecti.net.in/](http://connecti.net.in/)

The website is hosted on AWS and the domain name has been purchased from GoDaddy.

## Screenshots

<img width="600" alt="Capture1" src="https://user-images.githubusercontent.com/55212405/124575740-47a72200-de69-11eb-9359-66cf668345d2.PNG">

<img width="600" alt="Capture" src="https://user-images.githubusercontent.com/55212405/124575472-0f074880-de69-11eb-803a-89aedc21ef25.PNG"> 

<img width="600" alt="Capture2" src="https://user-images.githubusercontent.com/55212405/124575803-542b7a80-de69-11eb-9b60-b7f6a6828adc.PNG">


  

## Features

- Sign In/Sign Up using Passport.JS Local or Google Authentication.
- There is a forgot password option, wherin the users will be sent a unique link to their mail Ids through
  which they can update the password.
- Posting and Commenting.
- Liking posts and comments.
- Following/Unfollowing other users.
- Updating profile picture.
- Chatting on a public chat made using socket.io.
- It is a responsive website.

  
## Tech Stack

**Client:** HTML, CSS, JavaScript, JQuery. 

**Server:** Node.JS, Express.JS, MongoDB.

## Documentation

The project follows the MVC strcuture wherein our files are divided into Models, Views and Controllers folders.

    1. index.js - This is the entry point to the app where our server is created which listens to requests on port 8000.
    
    2. Models - It Consists of all the database schemas needed for the website.
               The main schemas used in the project are : 
                  a. User -  Defines a user on the website.
                  b. Post - Defines the post made by a user.
                  c. Comment - Defines the comment made by a user on a post.
                  d. Like - Defines the likes made by the user on a post/comment.
                  e. Follow - Establishes a connection between users.
                  f. PasswordToken - A unique access token generated if the user requests for a password change.
    
    3. Views - It consists of the front-end appearence of the website. In this project EJS is used as the view template.
    
    4. Controllers - They define all the actions that need to be performed when a specific route is request. 
                     There are controllers for home, user (which has a profile, sign in, sign up, update, forgot password), 
                     post (which has create, destroy), comment (which has creare destroy), like (which has create destroy),
                     and follow.
    
    5. Routes - It consists of the routes which route a partiular request to a particular controller. The index.js fail has the 
                main home route other routes are further routed from here.
    6. Config - It consists of the configuration files for the various libraries used in the project such as MongooseODM, Passport.JS Local and Google OAuth,
                Socket.io etc.
    

## Run Locally

Clone the project

```bash
  git clone https://github.com/rajarshisg/Social-Media-Site.git
```

Go to the project directory

```bash
  cd Social-Media-Site
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm start
```


## Authors

- [@rajarshisg](https://github.com/rajarshisg)

  

    

  
