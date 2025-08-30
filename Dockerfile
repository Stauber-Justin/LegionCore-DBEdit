# Stage 1: build static site
FROM node:20-alpine AS build
WORKDIR /app

# pnpm aktivieren (wie lokal)
RUN corepack enable && corepack prepare pnpm@10.15.0 --activate

# nur Lockfile + package.json zuerst: Cache bleibt effektiv
COPY package.json pnpm-lock.yaml .npmrc ./
RUN pnpm install --frozen-lockfile

# Rest kopieren und builden (Next 15: export ist in next.config.ts aktiviert)
COPY . .
RUN pnpm build   # erzeugt /app/out

# Stage 2: schlanker Webserver
FROM httpd:2.4-alpine
COPY --from=build /app/out/ /usr/local/apache2/htdocs/
EXPOSE 80
HEALTHCHECK CMD wget -qO- http://localhost/ || exit 1
