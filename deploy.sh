cd /var/www/staging/customer
git checkout development
git pull
ng build --configuration=staging
cp .htaccess_dist dist/alliance/.htaccess
