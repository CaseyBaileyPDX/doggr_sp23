export const Home = () => {
	return (
		<div>
			<Title />
			<Subtitle />
		</div>
	);
};

export function Title() {
	return <h1>Doggr</h1>;
}

export function Subtitle() {
	return <h3>Where your pets find love(tm)</h3>;
}
