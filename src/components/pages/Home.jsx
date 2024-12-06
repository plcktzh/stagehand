import { Link } from 'wouter';

export default function Home() {
	return (
		<main className="site-content content-padding">
			<h1 className="page-title">Welcome to Stagehand</h1>
			<h2 className="section-title">Introduction</h2>
			<p>
				This application is meant to ease managing your hardware
				synth/sequencer/whatever setup's state. You could use it to plan live
				gigs, document studio sessions etc.
			</p>
			<p>
				Think of the <Link href="/setups">Setups</Link> page like a big,
				slightly inconvenient patchbay with presets.
			</p>
			<h2 className="section-title">Todos / Known issues</h2>
			<p>
				This is very much in alpha stage. Saving and loading setups seems to
				work, but hasn't been tested thoroughly. So edge cases might be a
				situated a bit more towards the center than you'd assume at first.
			</p>
			<p>Aside from that, this is (part of) what needs to be done still:</p>
			<ul>
				<li>
					General:
					<ul>
						<li>Make app responsive</li>
						<li>Port to React Native, maybe</li>
						<li>
							Use a more robust way of handling setup, device, and other data
							(IndexedDB might not be the be-all-end-all)
						</li>
						<li>Add JSON import and export to all entities</li>
						<li>Make everything customizable</li>
					</ul>
				</li>
				<li>
					Setups
					<ul>
						<li>
							Don't start with all devices on init - add a library component for
							managing devices
						</li>
						<li>Make saving/loading process more intuitive</li>
						<li>Refine visuals (Include photos/drawings of devices?)</li>
					</ul>
				</li>
				<li>
					Devices, Device Categories, Connector Types, Data Types
					<ul>
						<li>
							Implement CRUD for devices, categories, connectors, data types
						</li>
						<li>Implement basic search and filter capability</li>
						<li>Refine visuals (Include photos/drawings of devices?)</li>
					</ul>
				</li>
			</ul>
		</main>
	);
}
