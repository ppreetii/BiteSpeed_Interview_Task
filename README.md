# BiteSpeed_Interview_Task
## Problem Statement [Link](https://github.com/ppreetii/BiteSpeed_Interview_Task/wiki)

## General Instructions :

### Tech Stack Used
 NodeJS, Typescript, Sequelize, MySQL, Joi, Jest, Swagger, Docker, Docker Compose

### Setup
- Clone Project : 
```
git clone https://github.com/ppreetii/BiteSpeed_Interview_Task.git
```
- Install dependencies:
```
yarn or npm install
```

- Create .env file in root directory using .env.example, and update with your information

- If you have Docker Desktop, you can run following command, otherewise install docker desktop before running this command:
```
docker compose up
```
- To shutdown running containers, run :
```
docker compose down
```
- If you simply want to run on localhost without docker, make sure you have following installed:
    1. NodeJS v16.14.2
    2. MySQL v8 
  Now run to start server locally, run following in project directory terminal:
```
yarn start or npm start
```
- To run the tests, run the command:
```
yarn test
```
- To access swagger documentation:
```
http://localhost:<port>/api/v1/api-docs
```