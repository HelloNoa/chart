mkdir -p /home/ec2-user/s3
mkdir -p /home/ec2-user/finexblock/src/config/env

aws s3 cp s3://finexblock-env2/coin-market/dev/chart-server/.dev.env /home/ec2-user/finexblock/src/config/env/.dev.env


# cat /home/ec2-user/finexblock/src/config/env/.prod.env
