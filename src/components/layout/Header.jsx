import { Link } from 'wouter';

export default function Header() {
	return (
		<header className="site-header content-padding">
			<span className="site-title">Stagehand</span>
			<nav className="main-navigation">
				<ul>
					<li>
						<Link href="/" className={(active) => (active ? 'is-active' : '')}>
							Home
						</Link>
					</li>
					<li>
						<Link
							href="/setups"
							className={(active) => (active ? 'is-active' : '')}
						>
							Setups
						</Link>
					</li>
					<li>
						<Link
							href="/devices"
							className={(active) => (active ? 'is-active' : '')}
						>
							Devices
						</Link>
					</li>
					<li>
						<Link
							href="/connector-types"
							className={(active) => (active ? 'is-active' : '')}
						>
							Connector Types
						</Link>
					</li>
					<li>
						<Link
							href="/data-types"
							className={(active) => (active ? 'is-active' : '')}
						>
							Data Types
						</Link>
					</li>
				</ul>
			</nav>
		</header>
	);
}
