FROM node:18-alpine as base
ENV TZ=Asia/Seoul
RUN npm install -g pnpm
