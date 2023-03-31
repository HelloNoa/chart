FROM 615794048861.dkr.ecr.ap-northeast-2.amazonaws.com/coin-market-socket-server-prod:master
ENV TZ=Asia/Seoul
EXPOSE 80

WORKDIR /home

COPY . server

RUN cp server/setup/release/run.sh ./run.sh

WORKDIR /home/server

RUN pnpm install
RUN pnpm run build

WORKDIR /home
ENTRYPOINT ["run.sh"]
