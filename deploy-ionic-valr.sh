git pull

cd ~/ssi-uport/ionic-valr/
npm i
ionic build --prod
sudo rm -rf /var/www/valr.myid.africa/html/
sudo mkdir /var/www/valr.myid.africa/html/
sudo cp -r www/* /var/www/valr.myid.africa/html/