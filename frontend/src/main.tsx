import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "@css/index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);

// Janky baby-React alternative
// window.global ||= window;
//
// type State = {
// 	name: string,
// 	count: number,
// }
//
// let state: State =  {
// 	name: "Doggr",
// 	count: 0,
// }
//
//
// global.emitEvent = (eventName) => {
//   let eventHandler = eventhandlers[eventName];
//   if (eventHandler) {
//     state = eventHandler(state);
//   }
//   render(state);
// }
//
// let eventhandlers = {
//   increaseCount: (oldState) => {
//     console.log("Increasing count");
//     return { ...oldState, count: oldState.count + 1 }
//
//   },
//   decreaseCount: (oldState) => {
//     console.log("Decrease count");
//     return { ...oldState, count: oldState.count - 1 }
//   },
//   changeName: (oldState) => {
//
//     console.log("Changed name");
//     return { ...oldState, name: "Spot"};
//   }
// }
//
//
// export function renderApp(state: State) {
// 	return `<div><p onClick="emitEvent('changeName')">Hi from ${state.name}</p><p onClick="emitEvent('increaseCount')">You have clicked ${state.count} times.</p></div>`;
// }
//
// export function render(state: State) {
// 	let html = renderApp(state);
//
//
// 	document.body.innerHTML = html;
// }
//
// render(state);
