const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');

const isAuth = require('./middleware/is-auth.js');

const graphQlSchema = require('./graphql/schema/index.js');
const graphQlResolvers = require('./graphql/resolvers/index.js');

const app = express();

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

app.use(isAuth);

app.use(
	'/graphql',
	graphqlHTTP({
		schema: graphQlSchema,
		rootValue: graphQlResolvers,
		graphiql: true,
	})
);

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
