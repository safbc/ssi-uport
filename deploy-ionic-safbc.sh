git pull

cd ~/ssi-uport/ionic-safbc/
# npm i
ionic build --prod
sudo rm -rf /var/www/safbc.myid.africa/html/
sudo mkdir /var/www/safbc.myid.africa/html/
sudo cp -r www/* /var/www/safbc.myid.africa/html/