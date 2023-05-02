cd ~
cd /home/ec2-user/finexblock

# export GOROOT=/usr/local/go
# export GOPATH=$HOME/go
# export PATH=$PATH:$GOROOT/bin:/usr/local/bin:$GOPATH/bin

# go install google.golang.org/protobuf/cmd/protoc-gen-go@v1.28
# go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@v1.2
# export PATH=“$PATH:$(go env GOPATH)/bin”

# go mod download
# go mod vendor

docker rm -f $(docker ps -aq)
sudo systemctl start docker

docker build -t finexblock-order .
docker run -d --network=host finexblock-order:latest