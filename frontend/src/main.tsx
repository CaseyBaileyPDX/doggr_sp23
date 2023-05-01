
type State = {
	name: string,
}

let state: State =  {
	name: "Doggr"
}

function renderApp(state: State) {
	return `<p onClick="changeName()">Hi from ${state.name}</p>`;
}

function render(state: State) {
	let html = renderApp(state);

	document.body.innerHTML = html;
}

render(state);













// import React from 'react'
// import ReactDOM from 'react-dom/client'
// import App from './App.tsx'
// import '@css/index.css';
//
// ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
// )

