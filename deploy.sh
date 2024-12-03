APP_HOST="ec2-user@ec2-52-78-245-231.ap-northeast-2.compute.amazonaws.com"
APP_PATH="~/project"
APP_ENTRY="dist/app.js"
APP_NAME="app"

ssh -i "/home/woohyun/AWS_test_key.pem" $APP_HOST "mkdir -p $APP_PATH"

rsync -e "ssh -i /home/woohyun/AWS_test_key.pem" -avr \
  --exclude=upload --exclude=node_modules --exclude=.git ./ $APP_HOST:$APP_PATH

ssh -i "/home/woohyun/AWS_test_key.pem" $APP_HOST \
  "cd $APP_PATH  && npm install && npm run build && pm2 start $APP_ENTRY --name $APP_NAME || pm2 restart $APP_NAME"