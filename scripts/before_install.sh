mkdir -p /home/ec2-user/s3
mkdir -p /home/ec2-user/src
aws s3 cp s3://finexblock-env2/coin-market/prod/chart-server/.prod.env /home/ec2-user/src/config/env/.prod.env

