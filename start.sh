#!/bin/bash

echo "Iniciando Angular..."
ng serve &

echo "Iniciando JSON Server..."
json-server db.json -m ./node_modules/json-server-auth &
