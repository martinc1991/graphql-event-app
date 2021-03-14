# EasyEvent: a GraphQL event-app

<p align='center'>
    <img  src="frontend\src\assets\easy-event-logo.png">
</p>

This app was made using React, GraphQL, Dataloader, Cloudinary SDK and Material UI.

## The project

My main motivation for this project was to learn GraphQL (also I've been wanting to use Material UI for a time now) so I could take on my real goal project: a web app connected to the PokeApi API. Although there's a GraphQL PokeApi out there, I wasn't satisfied by it's functionalities and decided to modify it to fit my needs.

So I started researching GraphQL and found some really cool tutorials on the web. I chose one and started to follow it step by step. By the time it was finished i wasn't really happy with the final project so I decided to add some features:

1. There can't be an event-app without images (so I added Cloudinary to manage that)
2. The CRUD of the app wasn't complete (deleting functionality was missing)
3. The design of that app was really basic and I wanted a well designed one

## Technologies

### Front-End

1. React
2. Material UI

### Back-End

1. GraphQL
2. Dataloader
3. Cloudinary SDK

## How to run the project

If you're here I'm assuming you know your way around the basics of JavaScript and you have Git, NodeJS and a code editor (VSC recommended) on your PC. If you don't, here are videos you can watch to solve that:

- [Git](https://www.youtube.com/watch?v=nbFwejIsHlY)
- [NodeJS](https://www.youtube.com/watch?v=1US-P13yKVs)
- [Visual Studio Code](https://www.youtube.com/watch?v=MlIzFUI1QGA)

To run this proyect properly, you should install MongoDB on your PC. In [this video](https://www.youtube.com/watch?v=FwMwO8pXfq0) you can learn how to do that.

### First Step

1. Create a folder so you can clone the project into it (you can do it directly on your desktop too).
2. Open the console of your preference and go to the folder you created in the previous step and run the command:

```js
git clone https://github.com/martinc1991/graphql-event-app.git
```

3. When the download is finished, in the same console as before, go the _client_ folder and run the `npm install`:

```js
cd client // (this is to navigate to the 'client' folder)
npm install
```

4. Next, go the _server_ folder and run `npm install`:

```js
cd .. // (going back to the root folder)
cd client // (this is to navigate to the 'server' folder)
npm install
```

By now, you have the full project installed.

### Second Step

1. Create a Mongo cluster by following [this video](https://www.youtube.com/watch?v=1duX6Nfevhc). From this video, you should get the **_connection string_** and the **_user and password credentials_** to connect to the DB.
2. Create an account on [Cloudinary](https://cloudinary.com/users/register/free). Once you're finished, the account details section on the Dashboard page shows your **_cloud name_** identifier, as well as your **_API key_** and **_API secret_**, which you will need in order to configure your SDK or to directly run API requests.
3. Once you have created the Cluster and obtained the credentials and the [connection string](https://docs.mongodb.com/manual/reference/connection-string/#connection-string-formats) and the credentials from Cloudinary too, go to the _backend_ folder. There is a file called `sample.json`. Inside that file copy the following code and replace the placeholder values with your own:

```js
{
	"env": {
		"MONGO_USER": "yourMongoUserHere",
		"MONGO_PASSWORD": "yourMongoPasswordHere",
		"MONGO_DBNAME": "yourMongoDBNameHere",
		"PORT": 8000,
		"CLOUDINARY_NAME": "yourCloudinaryNameHere",
		"CLOUDINARY_API_KEY": "yourCloudinaryApiKeyHere",
		"CLOUDINARY_API_SECRET": "yourCloudinaryApiSecretHere"
	}
}
```

4. Change `sample.json` name to `nodemon.json`

### Third (and last) Step

To (finally) run the project you have to run `npm start` both from the _frontend_ folder and the _backend_ folder.

##### Frontend folder

```js
// from the root folder
cd client
npm start
```

You should get a message like:

```js
> frontend@0.1.0 start C:\Users\Martin\Desktop\graphql-event-app\frontend
> react-scripts start
```

This will open a new tab in your browser where the app will run.

##### Backend folder

Run `npm start` on the _server_ folder:

```js
// from the root folder
cd server
npm start
```

Once you do that, you should get a message like:

```node
[nodemon] 2.0.7
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node app.js`
DB Connected
Listening on PORT 8000
```

Getting that means that the backend is properly running and you can start using the app!
