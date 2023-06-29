FROM node:17.0.1-bullseye-slim as builder
WORKDIR /app
RUN npm install -g @angular/cli@13
COPY package.json package-lock.json ./
RUN npm ci
COPY . .