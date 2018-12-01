import fetch from "node-fetch";

export function query() {
	return fetch("https://jsonplaceholder.typicode.com/posts")
		.then(res => res.json())
		.then(data => data)
        .catch(err => console.log(err))
}