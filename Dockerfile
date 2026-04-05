# 构建阶段：在 Render 里打包前端
FROM node:22-alpine AS build
WORKDIR /app

# 复制前端代码
COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

# 运行阶段：Nginx
FROM nginx:alpine
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]