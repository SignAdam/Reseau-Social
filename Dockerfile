# Utiliser une image de base officielle de Node.js
FROM node:14

# Définir le répertoire de travail à l'intérieur du conteneur
WORKDIR /app

# Copier le fichier package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances de l'application
RUN npm install

# Copier le reste du code de l'application
COPY . .

# Exposer le port que l'application va utiliser
EXPOSE 3000

# Démarrer l'application
CMD ["npm", "start"]
