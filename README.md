# DUDE PATH BASICS

## NODE SETUP

[Node/Express Tutorial](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/development_environment)

- create package.json
  ```bash
  npm init -y
  ```
- install express
  ```bash
  npm install express
  ```
- create basic app.js

  ```javascript
  const express = require("express");
  const app = express();

  const port = 23000;

  // health
  app.get("/api/health", (req, res) => {
    res.send({ status: "ok" });
  });

  // start server
  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
  ```

## GIT SETUP

[Git Tutorial](https://git-scm.com/docs/gittutorial/)

- create repository on github/gitlab/etc
- create basic .gitignore:
  ```
  node_modules
  .env
  .DS_Store
  ```
- initialize git repository
  ```bash
  git init
  ```
- add files to git
  ```bash
  git add .
  ```
- initial commit
  ```bash
  git commit -m "Initial"
  ```
- connect local Git to Github
  ```bash
  git remote add origin https://github.com/username/repo.git
  ```
- push
  ```bash
  git push -u origin main
  ```

## MONGODB SETUP

[MongoDB Tutorial](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x/)

- install homebrew (on mac)
- tap the mongodb homebrew tap
  ```bash
  brew tap mongodb/brew
  ```
- update brew and existing formulae
  ``bash
  brew update

  ```

  ```

- install mongodb
  ```bash
  brew install mongodb-community@6.0
  ```
- start mongoDB server
  ```bash
  brew services start mongodb-community@6.0
  ```

## DOCKER SETUP

[Docker Tutorial](https://www.docker.com/101-tutorial/)

- create 'Dockerfile':

  ```
  # Use an existing Node.js image as the base
  FROM node:18

  # Set the working directory to /app
  WORKDIR /app

  # Copy the package.json and package-lock.json files into the working directory
  COPY package*.json ./

  # Install dependencies with npm
  RUN npm install

  # Copy the rest of the application source code into the working directory
  COPY . .

  # include model (should actually be 'COPY models/ /app/models/' (?))
  COPY content.js .

  # Open the port on which the application will run
  EXPOSE 23000

  # Start the application when the container runs
  CMD ["node", "app.js"]
  ```

- build the docker image:
  ```bash
  docker build -t imagename .
  ```
- run the docker container: (docker run -p HOST_PORT:CONTAINER_PORT image_name)
  ```bash
  docker run -p 23000:23000 imagename
  ```

## DOCKER COMPOSE

- create docker-compose.yaml

  ```yaml
  version: "3.9"

  # Define the services that will run in this Docker Compose app
  services:
    # Define the "app" service
    app:
      # Build the Docker image for this service from the current directory
      build: .

      # Map port 23000 on the host machine to port 23000 on the container
      ports:
        - "23000:23000"

      # Specify that this service depends on the "db" service
      depends_on:
        - db

      # Set an environment variable that the app will use to connect to the MongoDB instance
      environment:
        MONGO_URL: mongodb://db:27017/dudeDB

    # Define the "db" service
    db:
      # Use the official MongoDB Docker image
      image: mongo

      # Always restart this container if it stops for any reason
      restart: always

      # Set an environment variable that specifies the name of the MongoDB database to create on startup
      environment:
        MONGO_INITDB_DATABASE: dudeDB
  ```

- Create 'docker-compose.prod.yaml' with an additional entry to prevent DB connections outside the container:

  ```yaml
  # Do not expose the database on any port
  ports:
    - "127.0.0.1:0:27017"
  ```

- start service:
  ```bash
  docker-compose up --build
  ```

## EXERCISE 5

- (new) project structure:

```
- gateway-service/
  - src/
    - index.js
  - Dockerfile
  - package.json

- data-service/
  - src/
    - index.js
  - Dockerfile
  - package.json

- user-service/
  - src/
    - index.js
  - Dockerfile
  - package.json
```

- install proxy in gateway-service:

```bash
npm install http-proxy-middleware
```

- docker-compose (ports!):

```yaml
version: "3.8"

services:
  # Gateway
  dude_gateway:
    build: ./gateway-service # Directory to build the service from
    ports:
      - "3000:3000" # Map the container port to the host port
    depends_on:
      - dude_data_service # Depend on the dude_data_service service
      - dude_user_service # Depend on the dude_user_service service

  # data-service
  dude_data_service:
    build: ./data-service # Directory to build the service from
    depends_on:
      - dude_mongo_data # Depend on the dude_mongo_data service

  # user-service
  dude_user_service:
    build: ./user-service # Directory to build the service from
    depends_on:
      - dude_mongo_user # Depend on the dude_mongo_user service

  # data-service DB
  dude_mongo_data:
    image: mongo # Use the mongo image
    container_name: dude_mongo_data # Set the container name
    volumes:
      - dude_data_db:/data/db # Define a volume and map it to the container
    ports:
      - "27018:27017" # Map the container port to the host port

  # user-service DB
  dude_mongo_user:
    image: mongo # Use the mongo image
    container_name: dude_mongo_user # Set the container name
    volumes:
      - dude_user_db:/data/db # Define a volume and map it to the container
    ports:
      - "27019:27017" # Map the container port to the host port

  # Define named volumes for persistent data storage, so that the data is not lost when the container is destroyed
  volumes:
    dude_data_db:
    dude_user_db:
```

- gateway service:

```javascript
const { createProxyMiddleware } = require("http-proxy-middleware");

const dataServiceProxy = createProxyMiddleware("/api/data", {
  target: "http://dude_data_service:3001",
  pathRewrite: { "^/api/data": "" },
  changeOrigin: true,
});

const userServiceProxy = createProxyMiddleware("/api/user", {
  target: "http://dude_user_service:3002",
  pathRewrite: { "^/api/user": "" },
  changeOrigin: true,
});

app.use(dataServiceProxy);
app.use(userServiceProxy);
```
