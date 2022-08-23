import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import {
	ApolloClient,
	InMemoryCache,
	gql,
	createHttpLink,
} from '@apollo/client';

const uri = 'darling-hermit-86.hasura.app/v1/graphql';
const secret =
	'i66GuFAqSZENP3tM16cB6liWytuqlzNBWbfMwB84YbR7ivWZ82bNA9kTHPBnNOMB';

// HTTP connection to the API
const httpLink = createHttpLink({
	uri: `https://${uri}`,
	headers: {
		'x-hasura-admin-secret': secret,
	},
});

const createApolloClient = () => {
	return new ApolloClient({
		cache: new InMemoryCache(),
		link: httpLink,
	});
};

const client = createApolloClient();

client
	.query({
		query: gql`
			query getTodo {
				todos {
					done
					id
					text
				}
			}
		`,
	})
	.then((data) => console.log(data));

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<>
		<App />
	</>
);
