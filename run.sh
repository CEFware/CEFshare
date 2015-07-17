#!/bin/bash

# Script for starting the app during development.

METEOR_ENV="staging" ROOT_URL='http://45.56.101.68/' MAIL_URL='smtp://meteor.test.mailbox%40gmail.com:meteor.test@smtp.gmail.com:465' meteor --settings private/settings.json -p 80
