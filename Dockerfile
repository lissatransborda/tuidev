ARG DATABASE_URL=file:/.dev.db

FROM node:latest
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma db push
RUN npm run build
EXPOSE 8000
CMD ["node", "dist/index.js"]