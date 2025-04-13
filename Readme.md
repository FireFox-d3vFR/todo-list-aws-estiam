# Commandes utiles
```shell
npm install
npm run dev
npm run build
npm run start

# Docker
docker build --platform="linux/amd64" -t nextjs-docker .  # Générer un container docker
docker run -p 3000:3000 --env-file .env nextjs-docker     # Lancer le container en local
docker tag nextjs-docker:latest XXXX.dkr.ecr.eu-west-3.amazonaws.com/YYYY/ZZZZ:latest # Taguer le container
docker push XXXX.amazonaws.com/nextjs-docker:latest

# AWS
aws ecr get-login-password --region eu-west-3 ...     # Récupérez un jeton d'authentification ECR
```

# Page vérification de la connexion à DynamoDB
**http://localhost/test**

# Fichier utile
**Dockerfile**
