





# Copy nginx config making it listen to port 80.
cp nginx_foosta_global.conf /etc/nginx/conf.d/

# Remove default nginx config from port 80.
rm /etc/nginx/sites-enabled/default

# Kill every process blocking port 80.
sudo lsof -t -i:80 | xargs sudo kill -9

# Restart nginx.
nginx
