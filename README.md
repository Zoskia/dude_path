# DUDE PATH BASICS

## NODE SETUP

- create package.json
    ```bash
    npm init -y
    ````
- install express   
    ```bash
    npm install express
    ```
- create basic app.js
    ```javascript
    const express = require('express');
    const app = express();

    const port = 23000;

    // health
    app.get('/api/health', (req, res) => {
    res.send({ status: 'ok' });
    });

    // start server
    app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
    });
    ```

## GIT SETUP

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



## DOCKER SETUP

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
#### DOCKER COMPOSE
- create docker-compuse.yaml