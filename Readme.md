Application contains two folders which contains Front End application and sample data server


# Miliu App - Frontend

## Technologies Used

- ionic - 1 https://ionicframework.com/docs/v1/overview/

## Software Required

- Node v8
- Ionic framework 1

# Sample data server

- Node v8
- express


## Development mode

### Run the server API
Navigate to folder `server` in your terminal and run:

- `npm install nodemon -g` - Nodemon will help developers to continue develop the sample server without re starting
- `npm install`  - to install server API dependencies

- `nodemon app.js` - to serve server API on http://localhost:8080

You can navigate to http://localhost:8080 in your browser to check provided API.

### Run Front end application

- `npm install -g ionic` - install ionic glbally

Navigate to folder `miliu-app` in your terminal and run:

- `npm  install`
- `bower install`
- `ionic serve` - to to serve client-side on http://localhost:8100 browser

### bower Pluggings used
    "font-awesome": "fontawesome#^4.7.0",
    "lodash": "^4.17.4",
    "angularjs-slider": "^6.4.3",
    "angular-google-chart": "^0.1.0",
    "angular-moment": "^1.2.0",
    "ngDraggable": "^0.1.11",
    "ngstorage": "^0.3.11"

## Configuration
Configuration files are at the path `www/js/config.js`


| Name | Default Value | Description |
| ---: | ---: | ------: |
| API | http://localhost:8080/ | URL where millu-app-backend is hosted |


## Production mode


## Deploy to Heroku

I have to deploy to Heroku server-side API and client-side code separately.

### Deploy server API

Navigate to folder `server` in your terminal and run:
- `git init` - to initiate git repository
- `git add .` - add file contents to the index
- `git commit -m"initial commit"` - commit
- `heroku create` - to create Heroku application
- `git push heroku master` - to deploy the app
- `heroku open` - to open deployed serve API URL in the browser to make sure it works. You will need this URL to configure client side.

### Ionic Installation
-
- Installing cordova
   `npm install -g cordova`

- Installing ionic
  `npm install -g ionic`

### Compiling and building instructions to android app

Change API url to hosted api url

Building the debug app:
- Run the following command
- `ionic cordova build android`
- Then go to the app folder (eg. miliu-app ) then go to following   path `platforms/android/app/build/outputs/apk/debug` to find the .apk file

- In case you get EACESS error while building the app, try deleting the file `hooks/after_prepare/010_add_platform_class.js` and running the build command again. Not really sure what the issue is, but deleting the hook solved the problem for me.

Running the app on a device:
- Connect the mobile device to the PC and then enable the debugging mode    in the device
- Then run the following command
- `ionic cordova run android`

- In case you get EACESS error while building the app, try deleting the file `hooks/after_prepare/010_add_platform_class.js` and running the command again. Not really sure what the issue is, but deleting the hook solved the problem for me.


Build the app with android and build .apk package.
By installing apk to android phone we can run the installed application


## Hosted API URL
https://miliu-ionic-app.herokuapp.com

## You tube video
https://youtu.be/dSg75bLeLCM
