FROM node:20-bookworm-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM alpine:latest
WORKDIR /app
COPY --from=builder /app/dist ./dist