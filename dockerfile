# 使用 Node.js 官方镜像作为基础镜像
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json 到工作目录
COPY package*.json ./

# 安装项目依赖
RUN npm install

# 复制项目文件到工作目录
COPY . .

# 构建项目
RUN npm run build

# 设置运行时的环境变量
ENV NODE_ENV production

# 暴露容器的 3000 端口
EXPOSE 3000

# 运行项目
CMD ["npm", "start"]
