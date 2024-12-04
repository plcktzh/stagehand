import { useQuery } from '@tanstack/react-query';
import { fetchAllAsArray } from '../../services/db';
import Spinner from '../layout/Spinner';
import ErrorMessage from '../layout/ErrorMessage';
import { Fragment } from 'react';
import { Pencil, PlusSquare } from '@phosphor-icons/react';

export default function DeviceCategories() {
	const {
		data: deviceCategories = [],
		isError,
		isPending,
		isSuccess,
		error,
	} = useQuery({
		queryKey: ['deviceCategories'],
		queryFn: fetchAllAsArray,
	});

	return (
		<div className="device-categories">
			{isPending && <Spinner />}
			{isError && <ErrorMessage error={error} />}
			{isSuccess && (
				<Fragment>
					<h1 className="page-title">Device Categories</h1>
					<ul className="cards">
						{deviceCategories.map((deviceCategory) => (
							<li key={deviceCategory.id} className="card">
								<h2 className="card__header">
									{deviceCategory.name[0]}
									<button className="card__button card__button--edit">
										<Pencil weight="duotone" />
									</button>
								</h2>
								<div className="card__content">
									<div
										className="device-category__icon"
										dangerouslySetInnerHTML={{ __html: deviceCategory.icon }}
									></div>
								</div>
							</li>
						))}
						<li className="card card--button-only">
							<button
								className="card__button card__button--add"
								aria-label="Add data type"
							>
								<PlusSquare weight="duotone" />
							</button>
						</li>
					</ul>
				</Fragment>
			)}
		</div>
	);
}

// TODO: Add functions for adding and editing data types
