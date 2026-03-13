

FROM alpine AS builder

WORKDIR /app

COPY index.html .

COPY style.css .

#----
FROM nginx:alpine

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=builder /app/index.html .

COPY --from=builder /app/style.css .

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]


