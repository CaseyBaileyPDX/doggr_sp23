export const Home = () => {
	return (
		<div className={"flex flex-col items-center justify-center " +
			"outline outline-offset-4 drop-shadow text-slate-50 rounded-full bg-blue-800 w-80 h-80 mx-auto mt-24"}>
			<Title />
			<Subtitle />
		</div>
	);
};

export function Title() {
	return <h1 className={"text-6xl mb-4 mx-1"}>Doggr</h1>;
}

export function Subtitle() {
	return <h3 className={"text-lg"}>Where your pets find love&trade;</h3>;
}
