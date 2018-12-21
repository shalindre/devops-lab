FROM node:lts-alpine

COPY index.js /Users/king/Documents/GitHub/devops-lab/

RUN npm install express mysql

CMD node /Users/king/Documents/GitHub/devops-lab//index.js