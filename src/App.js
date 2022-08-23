import { gql, useQuery, useMutation } from '@apollo/client';

const GET_TODOS = gql`
	query getTodo {
		todos {
			done
			id
			text
		}
	}
`;

const TOGGLE_TODO = gql`
	mutation toggleTodo($id: uuid!, $done: Boolean!) {
		update_todos(where: { id: { _eq: $id } }, _set: { done: $done }) {
			returning {
				done
				id
				text
			}
		}
	}
`;

function App() {
	const { data, loading, error } = useQuery(GET_TODOS);

	const [toggleTodo] = useMutation(TOGGLE_TODO);

	async function handleToggleTodo({ id, done }) {
		console.log('called');
		const data = await toggleTodo({
			variables: {
				id,
				done: !done,
			},
		});
		console.log(data);
	}

	if (loading) return <div>Loading Todos</div>;
	if (error) return <div>Error fetching Todos</div>;
	return (
		<div className="vh-100 code flex flex-column items-center bg-pink white pa3 fl-1">
			<h1 className="f2-1">
				GraphQL Checklist{'    '}
				<span role="img" aria-label="checkmark">
					✔
				</span>
			</h1>

			<form className="mb3">
				<input
					type="text"
					placeholder="Write your todo"
					className="pa2 f4 b--dashed"
				/>
				<button type="Submit" className="pa2 f4 bg-green">
					Create
				</button>
			</form>

			<div className="flex items-center justify-center flex-column">
				{data.todos.map((todo) => (
					<p
						onDoubleClick={() => handleToggleTodo(todo)}
						key={todo.id}
					>
						<span
							className={`pointer list pa1 f3 ${
								todo.done && 'strike'
							}`}
						>
							{todo.text}
						</span>
						<button className="bg-transparent bn f4">
							<span className="red"> &times;</span>
						</button>
					</p>
				))}
			</div>
		</div>
	);
}

export default App;
