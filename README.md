# GuajiritosPT

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.1.

## How to run:

### 1 - Run the following command to install dependencies:
```bash
npm install
```

### 2 - You can execute the development server and the fake API service at the same time by using the following methods:

**Linux** -> Execute the following command in the project root:
```bash
./start.sh
```

**Windows** -> Double-click the `start.bat` file in the project root.

## Development server

To start only a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## JSON-Server

To start only the fake API service, run: 

```bash
json-server db.json -m ./node_modules/json-server-auth
```
## Once running

The only user in the DB is "admin" with the password: "admin1". To log in, you must type the email: `admin@admin` and the password.


## Warning:
The Linux script has not been proven yet, so it may not work. In case it doesn't, try running the development server and JSON-server one at a time.
