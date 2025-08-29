FROM node:20-alpine

WORKDIR /app

# تثبيت deps
COPY package*.json ./
RUN npm ci

# نسخ الكود
COPY tsconfig*.json nest-cli.json ./
COPY src ./src

# منفذ
EXPOSE 3000

# تشغيل تطوير
CMD ["npm", "run", "start:dev"]
