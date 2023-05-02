mkdir -p /home/ec2-user/s3
mkdir -p /home/ec2-user/finexblock/src/config/env

aws s3 cp s3://finexblock-env2/coin-market/prod/order-server/.prod.env /home/ec2-user/finexblock/src/config/env/.prod.env

cat /home/ec2-user/s3/.prod.env

cat /home/ec2-user/finexblock/src/config/env/.prod.env
