git pull

cd ~/ssi-uport/ionic-monitor/
npm i
ionic build --prod

echo Removing old files
sudo rm -rf /var/www/ssi-monitor.myid.africa/html/
sudo mkdir /var/www/ssi-monitor.myid.africa/html/

echo Copying new files
sudo cp -r www/* /var/ssi-www/monitor.myid.africa/html/
