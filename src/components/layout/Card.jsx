import { Pencil } from '@phosphor-icons/react';

export default function Card({
	children,
	title,
	headingLevel = 2,
	editClickHandler,
}) {
	const Heading =
		headingLevel > 0 && headingLevel <= 6 ? `h${headingLevel}` : `h6`;

	return (
		<div className="card">
			{title && (
				<Heading className="card__header">
					{title}
					{editClickHandler && (
						<button
							className="card__button card__button--edit"
							onClick={editClickHandler}
						>
							<Pencil weight="duotone" />
						</button>
					)}
				</Heading>
			)}
			<div className="card__content">{children}</div>
		</div>
	);
}
