git pull

cd ~/ssi-uport/ionic-safbc/
npm i
ionic build --prod
sudo rm -rf /var/www/safbc.myid.africa/html/
sudo mkdir /var/www/safbc.myid.africa/html/
sudo cp -r www/* /var/www/safbc.myid.africa/html/

cd ~/ssi-uport/ionic-om/
npm i
ionic build --prod
sudo rm -rf /var/www/oldmutual.myid.africa/html/
sudo mkdir /var/www/oldmutual.myid.africa/html/
sudo cp -r www/* /var/www/oldmutual.myid.africa/html/

cd ~/ssi-uport/ionic-valr/
npm i
ionic build --prod
sudo rm -rf /var/www/valr.myid.africa/html/
sudo mkdir /var/www/valr.myid.africa/html/
sudo cp -r www/* /var/www/valr.myid.africa/html/

cd ~/ssi-uport/ionic-academy/
npm i
ionic build --prod
sudo rm -rf /var/www/blockchainacademy.myid.africa/html/
sudo mkdir /var/www/blockchainacademy.myid.africa/html/
sudo cp -r www/* /var/www/blockchainacademy.myid.africa/html/

