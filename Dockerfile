# Builder image
FROM node:18 as builder

WORKDIR /usr/src/app

COPY index.js yarn.lock tsconfig.json package*.json ./
COPY src ./src

RUN yarn install && npx -p typescript tsc



# Create minimal production image from builder.
FROM node:18-alpine
WORKDIR /usr/src/app

EXPOSE 80
ENV NODE_ENV=production
ENV PORT=80

COPY --from=builder --chown=node:node /usr/src/app/dist ./dist
COPY --from=builder --chown=node:node /usr/src/app/package*.json /usr/src/app/index.js /usr/src/app/yarn.lock ./

RUN yarn install --production=true
USER node

CMD ["node", "index.js"]