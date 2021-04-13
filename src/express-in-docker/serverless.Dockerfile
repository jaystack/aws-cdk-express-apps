
# FROM amazon/aws-lambda-nodejs:12
FROM public.ecr.aws/lambda/nodejs:14
ENV NODE_ENV production
ENV EXECUTION_ENV lambda

ARG FUNCTION_DIR="/var/task"
RUN mkdir -p ${FUNCTION_DIR}


WORKDIR ${FUNCTION_DIR}
COPY package*.json ./
RUN npm i

COPY . .
RUN npm run build

CMD [ "lambda-server.handle" ]