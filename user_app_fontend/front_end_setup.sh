curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -

sudo apt-get install -y nodejs

sudo apt-get install -y npm

node -v

echo node -V >> version.txt

cd ~/hub_s/front_end/

node -nb webserver_fe.js

cat version.txt
