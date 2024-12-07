# Daily Meal Planner

#### Final Demo Video and Presentation
Link: https://drive.google.com/file/d/1TpImKxIIq3XzEfxF5P-611TcXG2zSLb1/view?usp=sharing

#### Original Github Repo by arimai
Link: https://github.com/arimai/meal-planner?tab=readme-ov-file

#### Database Set-Up
Make sure to have a MongoDB account. 
- Create a cluster named "Cluster0"
- Set-up IAM roles.
- Connect to the cluster, select "Drivers", and then choose the "Node.js" driver with the latest version.
- Copy the connection string and paste it into the ./server/config.env file, keeping the initial "MONGODB_URI=" string in the file.
- Final string in the file should look like this: "MONGODB_URI=mongodb+srv://[user]:[password]@cluster0.xxxxx.mongodb.net/..."
- If connection is unavailable, check your Network Access settings, and whitelist your IP address.

#### [OPTIONAL] Set-Up Edamam Access
The project already sets up the Edamam access. If you want to connect to it yourself:
- Go to https://developer.edamam.com/edamam-docs-recipe-api.
- Sign-up for the Recipe Search API, and copy the Edamam ID and Key.
- Replace the lines in ./src/utils/data/data.js with the Edamam ID and Edamam key.
  
const API = {
  ID : "EDAMAM_ID",
  KEY : "EDAMAM_KEY",
  URL : "https://api.edamam.com/search?",
}

#### Running the application
- Install packages by running "npm i" in the root folder (one time).
- Go into ./server and run "node server.js" to start the server. Wait until you see "Connected to MongoDB using Mongoose!"
- Go back into the root folder and run "npm run start". If asked to switch ports, answer yes.
