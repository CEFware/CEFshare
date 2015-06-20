# CEFshare
A Sharing Economy Market Place solution written in meteorJS

#Dependency

GraphicsMagick to handle uploaded images: create thumbs & do crop to 1:1 aspect ratio so images fit our design

```sudo apt-get install graphicsmagick```



The app must be started with ```./run.sh``` to have Stripe settings loaded & cart work 
Locally it must be run with ```meteor --settings private/settings.json``` to have cart working

Use 4242 4242 4242 4242 card to test

.....

admin login credentials:
```admin@admin.com
aaaaaa1```

.....

to make admin email verified ```meteor mongo``` needs to be run in server console with next command go ge user id for update 
```
db.users.find()
```
and this command to actually make admin e-mail verified
```
db.users.update({_id:"aXoXGxaPpzHWAEhJw"},{$set:{roles:{"__global_roles__":["verified","admin"]}}})
```
