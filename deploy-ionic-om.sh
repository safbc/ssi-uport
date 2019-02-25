git pull

cd ~/ssi-uport/ionic-om/
npm i
ionic build --prod
sudo rm -rf /var/www/oldmutual.myid.africa/html/
sudo mkdir /var/www/oldmutual.myid.africa/html/
sudo cp -r www/* /var/www/oldmutual.myid.africa/html/