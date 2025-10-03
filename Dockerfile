# Stage 1: build the Angular app
FROM node:18 AS build
WORKDIR /app

# copy package files first (cache optimization)
COPY package*.json ./
RUN npm ci --silent

# copy rest and build
COPY . .
RUN npm run build -- --configuration production || npm run build

# Stage 2: serve with nginx
FROM nginx:stable-alpine
COPY --from=build /app/dist/essentials /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
