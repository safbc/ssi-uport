
cd ~/ssi-uport/ionic-academy/
git pull
npm i
ionic build --prod
sudo rm -rf /var/www/blockchainacademy.myid.africa/html/
sudo mkdir /var/www/blockchainacademy.myid.africa/html/
sudo cp -r www/* /var/www/blockchainacademy.myid.africa/html/
