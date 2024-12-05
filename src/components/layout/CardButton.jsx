export default function CardButton({ label, icon, onClickHandler }) {
	return (
		<div className="card card--button-only">
			<button
				className="card__button card__button--add"
				aria-label={label}
				onClick={onClickHandler}
			>
				{icon}
			</button>
		</div>
	);
}
