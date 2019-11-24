# using alpine base image for simplicity
FROM node:12.2.0-alpine

# assigning working dir
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# installing dependencies
# RUN npm install
# --no-cache: download package index on-the-fly, no need to cleanup afterwards
# --virtual: bundle packages, remove whole bundle at once, when done

# RUN apk --no-cache --virtual build-dependencies add \
#     python \
#     make \
#     g++ \
#     && npm install \
#     && apk del build-dependencies

RUN apk add --no-cache --virtual .gyp \
    python \
    make \
    g++ \
    && npm install \
    && apk del .gyp

# copying all files - except node_modules (exempted through via .dockerignore) 
# If you are building your code for production
# RUN npm ci --only=production

# RUN npm install

# Bundle app source
COPY . .

#exposing the endpoint
EXPOSE 8000

# running the command
CMD ["npm","run", "prod-docker"]
