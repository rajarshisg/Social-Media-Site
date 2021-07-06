# Connecti : A Social Media Website

Connecti is a full stack Social Media Website created using Express.JS. It is the one stop destination to connect with your frends and family. 


## Visit the official website!

Visit the Connecti website from this link : [http://connecti.net.in](http://connecti.net.in/)
## Features

- Sign In/Sign Up using Local or Google Authentication.
- Posting and Commenting.
- Liking posts and comments.
- Following/Unfollowing other users.
- Updating profile picture.
- Chatting on a public chat made using socket.io.
- It is a responsive website.

  
## Tech Stack

**Client:** HTML, CSS, JavaScript, JQuery. 

**Server:** Node.JS, Express.JS, MongoDB.

  
## Authors

- [@rajarshisg](https://github.com/rajarshisg)

  
## Documentation

The project follows the MVC strcuture wherein our files are divided in Models, Views and Folders.

    1. Models - It Consists of all the database schemas needed for the website.
               The main schemas used in the project are : 
                  a. User -  Defihes a user on the website.
                  b. Post - Defines the post made by a user.
                  c. Comment - Defines the comment made by a user on a post.
                  d. Like - Defines the likes made by the user on a post/comment.
                  e. Follow - Establishes a connection between users.
                  f. PasswordToken - A unique access token generated if the user requests for a password change.
    
    2. Views - It consists of the front-end appearence of the website. In this project EJS is used as the view template.
    
    3. Controllers - They define all the actions that need to be performed when a specific route is request. There are controlloers for home, user (which has a profile, sign in, sign up, forgot password), post (which has create, destroy), comment (which has creare destroy), like (which has create destroy).
    

  
