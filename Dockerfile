FROM php:8.2-cli

# Install dependencies
RUN apt-get update && apt-get install -y \
    git curl zip unzip libpng-dev libonig-dev libxml2-dev libzip-dev \
    nodejs npm

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_mysql mbstring exif pcntl bcmath gd zip

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app

COPY . .

# Install dependencies
RUN composer install --no-dev --optimize-autoloader --ignore-platform-reqs
RUN npm install && npm run build

# IMPORTANT: expose correct port
EXPOSE 8080

# IMPORTANT: use Laravel server
CMD php artisan serve --host=0.0.0.0 --port=${PORT:-8080}

CMD php artisan migrate --force && php -S 0.0.0.0:$PORT -t public