# FROM node:18-alpine as base
# ENV TZ=Asia/Seoul
# RUN npm install -g pnpm
FROM node:18-alpine
ENV TZ=Asia/Seoul
EXPOSE 80
EXPOSE 50051

WORKDIR /home

COPY . server

RUN cp server/setup/master/run.sh ./run.sh

WORKDIR /home/server
RUN npm install -g pnpm@7

RUN pnpm install
RUN pnpm -v
RUN pnpm run build

WORKDIR /home
RUN chmod +x ./run.sh
ENTRYPOINT ["./run.sh"]
