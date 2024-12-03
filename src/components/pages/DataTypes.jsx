import { useQuery } from '@tanstack/react-query';
import { db, fetchAllAsArray } from '../../services/db';
import Spinner from '../layout/Spinner';
import { Fragment } from 'react';
import ErrorMessage from '../layout/ErrorMessage';
import { Pencil, PlusSquare } from '@phosphor-icons/react';

export default function DataTypes() {
	const {
		data: dataTypes = [],
		isError,
		isPending,
		isSuccess,
		error,
	} = useQuery({
		queryKey: ['dataTypes'],
		queryFn: fetchAllAsArray,
	});

	return (
		<div className="data-types">
			{isPending && <Spinner />}
			{isError && <ErrorMessage error={error} />}
			{isSuccess && (
				<Fragment>
					<h2 className="page-title">Data Types</h2>
					<ul className="cards">
						{dataTypes.map((dataType) => (
							<li key={dataType.id} className="card">
								<h3 className="card__header">
									{dataType.name}
									<button className="card__button card__button--edit">
										<Pencil weight="duotone" />
									</button>
								</h3>
								<div className="card__content">
									<h4 className="card__content__header">
										Permitted data / signal types:
									</h4>
									<ul className="data-types__specs">
										{dataType.specs.map((spec) => (
											<li key={spec} className="data-types__specs__item">
												{spec}
											</li>
										))}
									</ul>
								</div>
							</li>
						))}
						<li className="card card--button-only">
							<button
								className="card__button card__button--add"
								ariaLabel="Add data type"
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
