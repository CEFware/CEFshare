#!/bin/bash

# Script for starting the app during development.

METEOR_SETTINGS='{"public": {"development":{"marketplaceName":"DEVELOPMENT","url":"http://localhost:3000/","color":"green","stripe_pk":"pk_test_TFpUZNcfgsDyj1NUeEeVmfOH"},"staging":{"marketplaceName":"STAGING","url":"http://45.56.101.68/","color":"green","stripe_pk":"pk_test_TFpUZNcfgsDyj1NUeEeVmfOH"},"production":{"marketplaceName":"PRODUCTION","url":"http://45.56.101.68/","color":"green","stripe_pk":"pk_test_TFpUZNcfgsDyj1NUeEeVmfOH"},"color":"green","stripe_pk":"pk_test_TFpUZNcfgsDyj1NUeEeVmfOH"},"private":{"development":{"path":"/home/shkomg/marketplaces/","supportEmail":"meteor.test.mailbox@gmail.com","stripe_sk":"sk_test_HHjUJLDvCWrAsvSp5pF2R2tV"},"staging":{"path":"/root/marketplaces/","supportEmail":"meteor.test.mailbox@gmail.com","stripe_sk":"sk_test_HHjUJLDvCWrAsvSp5pF2R2tV"},"production":{"path":"/home/shkomg/marketplaces/","supportEmail":"meteor.test.mailbox@gmail.com","stripe_sk":"sk_test_HHjUJLDvCWrAsvSp5pF2R2tV"}},"stripe_sk":"sk_test_HHjUJLDvCWrAsvSp5pF2R2tV","client_id":"ca_6Lxw3hsqjNbYWX8siNn9vU0108EEwbRu"}' node main.js

