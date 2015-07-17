#!/bin/bash

# Script for starting the app during development.

METEOR_ENV="staging" ROOT_URL='http://alpha.cefware.com' MAIL_URL='smtp://meteor.test.mailbox%40gmail.com:meteor.test@smtp.gmail.com:465' --settings private/settings.json meteor -p 80
