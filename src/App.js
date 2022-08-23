import { gql, useQuery, useMutation } from '@apollo/client';
import { useState } from 'react';

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

const ADD_TODO = gql`
	mutation addTodo($text: String!) {
		insert_todos(objects: { text: $text }) {
			returning {
				done
				text
				id
			}
		}
	}
`;

const DELETE_TODO = gql`
	mutation deleteTodo($id: uuid!) {
		delete_todos(where: { id: { _eq: $id } }) {
			returning {
				id
				done
				text
			}
		}
	}
`;

function App() {
	const [todoText, setTodoText] = useState('');

	const { data, loading, error } = useQuery(GET_TODOS);
	const [toggleTodo] = useMutation(TOGGLE_TODO);
	const [addTodo] = useMutation(ADD_TODO, {
		onCompleted: () => setTodoText(''),
	});
	const [deleteTodo] = useMutation(DELETE_TODO);

	async function handleToggleTodo({ id, done }) {
		const data = await toggleTodo({
			variables: {
				id,
				done: !done,
			},
		});
		console.log('toggled todo', data);
	}

	async function handleAddTodo(e) {
		e.preventDefault();
		if (!todoText.trim()) return;

		const data = await addTodo({
			variables: { text: todoText },
			refetchQueries: [{ query: GET_TODOS }],
		});
		console.log('created todo', data);
	}

	async function handleDeleteTodo({ id, text }) {
		const isConfirmed = window.confirm(`Do you want to delete ${text}`);
		if (isConfirmed) {
			const data = await deleteTodo({
				variables: { id },
				update: (cache) => {
					const prevData = cache.readQuery({ query: GET_TODOS });
					console.log(prevData);
					const newTodos = prevData.todos.filter(
						(todo) => todo.id !== id
					);
					cache.writeQuery({
						query: GET_TODOS,
						data: { todos: newTodos },
					});
				},
			});
			console.log('deleted todo', data);
		}
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

			<form className="mb3" onSubmit={handleAddTodo}>
				<input
					type="text"
					placeholder="Write your todo"
					className="pa2 f4 b--dashed"
					onChange={(e) => setTodoText(e.target.value)}
					value={todoText}
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
							<span
								className="red"
								onClick={() => handleDeleteTodo(todo)}
							>
								{' '}
								&times;
							</span>
						</button>
					</p>
				))}
			</div>
		</div>
	);
}

export default App;
