#! /bin/bash
echo '>> building dynamic pages server image'

aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 511712716284.dkr.ecr.us-east-1.amazonaws.com
docker build -t express-in-lambda . -f serverless.Dockerfile
docker tag express-in-lambda:latest 511712716284.dkr.ecr.us-east-1.amazonaws.com/express-in-lambda:latest
docker push 511712716284.dkr.ecr.us-east-1.amazonaws.com/express-in-lambda:latest