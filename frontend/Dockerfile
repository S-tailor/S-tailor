FROM node:20.11.1-alpine as builder
WORKDIR /app
COPY package.json .
COPY package-lock.json .
COPY yarn.lock .

RUN yarn
COPY . .
RUN yarn build

FROM nginx:stable-alpine as runner
COPY ./nginx_stage/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
