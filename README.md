# Neighborhood Watch

Neighborhood Watch is a social community app that allows users to stay informed about what's going on in their city or other cities that they might be interested in. Users can search for upcoming events, stay on their toes about the latest local crime, or browse through our extensive Lost and Found section. Users can also connect with their fellow neighbors who choose to leave their profile on public and possibly make lifelong friendships.

## Demo

- Live Preview can be found at : https://neighborhood-watch-client.now.sh/


## Client Side Github Repo

- https://github.com/Edweezu/neighborhood-watch-client


## Screenshots

|  Landing Page  | Create Account | Create Profile |  Login |  
| -- | -- | -- | -- | 
| <img src="./readme-images/landing-page.png" alt="landing-page" width="600"/> | <img src="./readme-images/create-account.png" alt="create-account" width="600"/> |  <img src="./readme-images/create-profile.png" alt="create-profile" width="600" /> |  <img src="./readme-images/login.png" alt="login" width="600" />


|  Main Dashboard  |  Post Page  |  User Profile  | Member Profiles | 
| -- | -- | -- | -- |
| <img src="./readme-images/dashboard.png" alt="dashboard" width="600"/> | <img src="./readme-images/post-page.png" alt="post-page" width="600"/> | <img src="./readme-images/profile-page.png" alt="user-profile" width="600"/> | <img src="./readme-images/member-profiles.png" alt="member-profiles" width="600"/>


## Schema Design
![Schema](https://github.com/Edweezu/neighborhood-watch-server/blob/master/readme-images/schema.png)

## Route Paths

### Users
**/api/users**
- GET
  - Returns a 200 response containing all registered users currently in the database
  
**/api/users/register**
- POST
  - Creates a new user with the information from the request body and saves it to the database. Hashes the password and returns a 201 response with only the username
  - If any required fields are missing, returns a 400 response
  - If username already exists, returns a 400 response

**/api/users/register/:userid**
- PATCH
  - Updates the user with the supplied userid using the information provided in the request body and saves it to the database. Uses the username and userid to create a JWT token to send back to the user
  - If any required fields are missing, returns a 400 response
 
**/api/users/login** 
- POST
  - Uses the information provided in the request body to check if the username exists and if the password matches the hashed password in the database. If so, returns a JWT token to send back to the user.
  - If any required fields are missing, returns a 400 response
  - If username doesn't exist or password doesn't match, returns a 400 response
  
**/api/users/profile** 
- GET
  - Returns a 200 response containing all the user information pertaining to the user currently logged in
- PATCH
  - Updates the logged in user with the info provided in the request body. If the request body contains an image, it first uploads that image onto Cloudinary and attaches the Cloudinary URL onto the object that is saved to the database. If there is no image, it simply updates the user in the database and returns the user info back to the client.
  - If user doesn't exist, returns a 400 response 

### Posts
**/api/posts** 
- GET
  - Returns a 200 response containing all posts located in the database. 
- POST
  - Creates a new post with the information from the request body, saves it to the database, and sends the post back to the client. If the request body contains an image, it first uploads the image onto Cloudinary and attaches a reference url to the database. 
   - If any required fields are missing, returns a 400 response

**/api/posts/:postid**

    
 
  


## Technologies Used
  - Javascript
  - CSS3
  - React
  - Node
  - Express
  - PostgreSQL
  - Mocha
  - Chai
  - Heroku
  - Geocities API
  


## Development RoadMap (v2)
 - Implementing a Post Image Modal that expands a post image on click
 - Ability to filter for a collection of posts depending on the search term
 - Expanding the User's Profile Page by adding in sections for a user's posts and comments
 - Adding a user image to go along with each post and comment 

