import { GithubLogo } from '@phosphor-icons/react';

export default function Footer() {
	return (
		<footer className="site-footer content-padding">
			<a href="https://github.com/plcktzh/stagehand">
				<GithubLogo weight="duotone" />
				Github
			</a>
		</footer>
	);
}
