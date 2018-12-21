# Answers

Lastname: KESRI
Firstname: Lucas

## 2.2
command: sudo docker run testlk

## 2.3
question: Ce n'est pas possible car les ports ne sont pas ouverts.
command: sudo docker run -i --expose:3000 testlk

## 2.5
question: Il faut modifier le tag de l'image pour le faire correspondre au repository.
command: sudo docker login - sudo docker tag testlk shalindre/devops_lab - sudo docker push shalindre/devops_lab

## 2.6
command: sudo docker system prune -a

question: 
sudo docker pull shalindre/devops_lab
sudo docker create shalindre/devops_lab
command:

command:

## 2.7
question: sudo docker ps -a
question:
command: 

command:

## 2.8
question:
output:

## 3.1
command: sudo docker-compose up

## 3.4
command: sudo docker-compose up -d 
command: sudo docker-compose logs
