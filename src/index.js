import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import {
	ApolloClient,
	InMemoryCache,
	createHttpLink,
	ApolloProvider,
} from '@apollo/client';

const hasura_uri = 'darling-hermit-86.hasura.app/v1/graphql';
const hasura_secret =
	'i66GuFAqSZENP3tM16cB6liWytuqlzNBWbfMwB84YbR7ivWZ82bNA9kTHPBnNOMB';

// HTTP connection to the API
const httpLink = createHttpLink({
	uri: `https://${hasura_uri}`,
	headers: {
		'x-hasura-admin-secret': hasura_secret,
	},
});

const createApolloClient = () => {
	return new ApolloClient({
		cache: new InMemoryCache(),
		link: httpLink,
	});
};
const client = createApolloClient();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<ApolloProvider client={client}>
		<App />
	</ApolloProvider>
);
