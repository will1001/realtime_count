FROM node:19-alpine3.16
RUN mkdir -p /opt/app
WORKDIR /opt/app
COPY . .
RUN npm config set registry http://registry.npmjs.org/
RUN npm install -g node-gyp-install
RUN npm install -g pm2
RUN npm install --save
RUN npm install --ignore-scripts=false --foreground-scripts --verbose sharp
RUN npm install --platform=linuxmusl --arch=x64 sharp
CMD [ "npm", "run", "pm2" ]