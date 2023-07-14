FROM node:18.16.1-bullseye-slim as builder
WORKDIR /app
RUN npm install -g @angular/cli@13
COPY package.json package-lock.json ./
RUN npm ci
COPY . .