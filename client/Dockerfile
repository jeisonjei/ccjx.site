FROM nginx:1.21.0-alpine
# Remove default Nginx configuration
RUN rm -rf /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/nginx.conf
WORKDIR /usr/share/nginx/html
COPY ./dist/client .
CMD ["nginx", "-g", "daemon off;"]