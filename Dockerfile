FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
COPY yarn.lock ./
COPY index.js ./
COPY dist/ ./dist/

ENV NODE_ENV=production
ENV PORT=80
RUN yarn install

EXPOSE 80

CMD ["node", "index.js"]
# If you are building your code for production
# RUN npm ci --only=production