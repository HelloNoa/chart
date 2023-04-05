# FROM 615794048861.dkr.ecr.ap-northeast-2.amazonaws.com/coin-market-socket-server-prod:master
FROM node:18-alpine
ENV TZ=Asia/Seoul
EXPOSE 80

WORKDIR /home

COPY . server

RUN cp server/setup/master/run.sh ./run.sh

WORKDIR /home/server
RUN npm install -g pnpm@7

RUN pnpm install
RUN pnpm -v
RUN pnpm run build

WORKDIR /home
ENTRYPOINT ["run.sh"]
