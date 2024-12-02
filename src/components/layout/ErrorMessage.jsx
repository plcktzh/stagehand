import { Bug } from '@phosphor-icons/react';

export default function ErrorMessage({ error = null }) {
	return (
		<div className="error-message">
			<Bug weight="duotone" />
			<p>
				Uh oh.{` `}
				{error && (
					<span>
						Something went wrong:
						<br />
						<em>{error.message}</em>
					</span>
				)}
			</p>
		</div>
	);
}
