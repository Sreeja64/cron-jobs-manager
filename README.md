# cron-jobs-manager
Create schedule and manage cron jobs and check their logs

# Tech Stack:

Docker

Expressjs

Vuejs

Nodejs

sqlite

node-scheduler

dockerode

# Commands to run the cron-jobs-manager locally:

Create a .env file in the root folder and the following content:
```
PORT = 3000

ENV= LOCAL

DB_NAME=cronjob

DB_PASSWORD=

DB_USER=

DB_DIALECT=sqlite
```
Run the following commands:
```
npm install 

cd client/

npm install

npm run build

npm run generate 

[A dist folder gets created. Copy/Move the folder in the root folder.]

cd ..

node .
```

# Commands to run the cron-jobs-manager by docker:

docker pull sreejade/cron-jobs-manager:v1

docker run -e PORT=3033 -p 3000:3033 -v /var/run/docker.sock:/var/run/docker.sock --mount source=myvol,target=/var/lib sreejade/cron-jobs-manager:v1
