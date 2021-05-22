FROM node:15
WORKDIR /app
COPY package.json .
RUN yarn
ARG NODE_ENV
RUN if [ "$NODE_ENV" = "development"]; \
        then npm install; \
        else npm install --only=production; \
        fi
COPY . ./
ENV PORT 3000
EXPOSE $PORT
CMD ["npm", "run", "start"]