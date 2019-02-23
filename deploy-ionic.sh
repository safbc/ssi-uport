git pull

cd ~/ssi-uport/ionic-safbc/
npm i
ionic build --prod
sudo rm -rf /var/www/safbc.myid.africa/html/
sudo mkdir /var/www/safbc.myid.africa/html/
sudo cp -r www/* /var/www/safbc.myid.africa/html/


cd ~/ssi-uport/ionic-valr/
npm i
ionic build --prod
rm -rf /var/www/valr.myid.africa/html/
sudo mkdir /var/www/valr.myid.africa/html/
cp -r www/* /var/www/vlar.myid.africa/html/


cd ~/ssi-uport/ionic-safbc/
npm i
ionic build --prod
rm -rf /var/www/safbc.myid.africa/html/
sudo mkdir /var/www/safbc.myid.africa/html/
cp -r www/* /var/cd .www/safbc.myid.africa/html/


cd ~/ssi-uport/ionic-safbc/
npm i
ionic build --prod
rm -rf /var/www/safbc.myid.africa/html/
sudo mkdir /var/www/safbc.myid.africa/html/
cp -r www/* /var/www/safbc.myid.africa/html/


cp -r safbc/* /var/www/safbc.myid.africa/html/
cp -r valr/* /var/www/valr.myid.africa/html/
cp -r oldmutual/* /var/www/oldmutual.myid.africa/html/
cp -r academy/* /var/www/blockchainacademy.myid.africa/html/
cp -r experiments/bac19-monitor/www/* /var/www/ssi-monitor.myid.africa/html
