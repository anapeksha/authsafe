FROM node:lts-alpine AS base

FROM base AS builder
WORKDIR /app

ENV NODE_ENV development

COPY . .

RUN npm install
RUN npx prisma generate
RUN npm run build


FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV PORT 3000

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

COPY --from=builder --chown=nestjs:nodejs /app/package*.json ./
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nestjs:nodejs /app/public ./public
COPY --from=builder --chown=nestjs:nodejs /app/README.md ./

RUN npm ci
RUN npx prisma generate

USER nestjs

EXPOSE 3000

CMD npm run start:prod
