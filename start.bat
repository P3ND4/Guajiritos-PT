@echo off
start cmd /k "ng serve"
start cmd /k "json-server db.json -m ./node_modules/json-server-auth"
