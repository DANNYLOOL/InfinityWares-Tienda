# Usa una imagen de Node.js 14.15.0 para construir el proyecto
FROM node:14.15.0 AS build

# Establece el directorio de trabajo
WORKDIR /app

# Copia el package.json y el package-lock.json al directorio de trabajo
COPY package*.json ./

# Instala las dependencias de la aplicación
RUN npm install

# Copia el resto de los archivos de la aplicación
COPY . .

# Construye la aplicación Angular
RUN npm run build --prod

# Usa una imagen de servidor web para servir la aplicación
FROM nginx:alpine

# Copia los archivos de construcción de la etapa anterior al directorio de Nginx
COPY --from=build /app/dist/tienda /usr/share/nginx/html

# Exponer el puerto que Nginx usará
EXPOSE 80

# Comando para correr Nginx
CMD ["nginx", "-g", "daemon off;"]
