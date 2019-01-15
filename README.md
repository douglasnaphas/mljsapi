Mad Liberation JavaScript API
================================

This is the Express JS backend for Mad Liberation, a game of mad lib haggadahs for Passover.

Run tests
----------
`npm run test -- --watch`


Run the server locally
-----------------------
`./run-dev.sh`

Use a different host
--------------------
This is useful when running on Cloud9.

    sed 's/NODE_ENV: production/NODE_ENV: development/' ./template.yml > ./dev-template.yml
    sam local start-api --template ./dev-template.yml --port 3003 --host <HOST_IP>
    
For AWS instances, use the private IP.

For example:

    sed 's/NODE_ENV: production/NODE_ENV: development/' ./template.yml > ./dev-template.yml
    sam local start-api --template ./dev-template.yml --port 3002 --host 172.31.41.172
