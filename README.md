# Connecti : A Social Media Website

Connecti is a full Social Media Website created using Express.JS. It is a one stop destination to connect with your frends and family. 


## View the project from it's official website

Visit the Connecti website from this link : [https://www.github.com/octokatherine](https://www.github.com/octokatherine)
## Features

- Sign In/Sign Up using Local or Google Authentication.
- Posting and Commenting.
- Liking posts and comments.
- Following/Unfollowing other users.
- Updating profile picture.
- Chatting on a public chat made using socket.io.

  
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
    
    3. Controllers - They define all the actions that need to be performed when a specific route is requested.
    

  
