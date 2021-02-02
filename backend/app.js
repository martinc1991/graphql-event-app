const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');
const multer = require('multer');

// Import Middlewares
const isAuth = require('./middleware/is-auth.js');
const multerMiddleware = require('./middleware/multer.js');

// graphQL
const graphQlSchema = require('./graphql/schema/index.js');
const graphQlResolvers = require('./graphql/resolvers/index.js');

const app = express();

// Basic Multer DiskStorage Configuration
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, __dirname + '/middleware/uploads/');
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname);
	},
});
const upload = multer({ storage });

// Middlewares
app.use(bodyParser.json());

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	if (req.method === 'OPTIONS') {
		return res.sendStatus(200);
	}
	next();
});

// authorization
app.use(isAuth);

// image management
app.use('/graphql', upload.single('eventImage'), multerMiddleware);

// graphQL
app.use(
	'/graphql',
	graphqlHTTP({
		schema: graphQlSchema,
		rootValue: graphQlResolvers,
		graphiql: true,
	})
);
// Middlewares

// Connection to the DB and server start
mongoose
	.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.rkwr6.mongodb.net/${process.env.MONGO_DBNAME}?retryWrites=true&w=majority`, { useUnifiedTopology: true, useNewUrlParser: true })
	.then(() => {
		app.listen(process.env.PORT, () => {
			console.log(`Listening on PORT ${process.env.PORT}`);
		});
		console.log('DB Connected');
	})
	.catch((err) => {
		console.log(err);
	});
// Connection to the DB and server start
