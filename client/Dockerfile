# pull official base image
FROM node:15.9.0-alpine3.13 
# set working directory
WORKDIR /app

# install app dependencies
COPY package.json ./

RUN npm install

# add app
COPY . ./

# start app
CMD ["npm", "start"]
