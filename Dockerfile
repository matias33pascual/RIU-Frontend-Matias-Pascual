FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build:ssr

FROM node:18-alpine AS production

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./

RUN npm ci --only=production && npm cache clean --force

EXPOSE 4000

USER node

CMD ["node", "dist/riu-frontend-matias-pascual/server/server.mjs"]