#!/bin/bash

# Script for starting the app during development.

ROOT_URL='http://localhost:3000/' MAIL_URL='smtp://meteor.test.mailbox%40gmail.com:meteor.test@smtp.gmail.com:465' meteor --settings private/settings-loc.json
