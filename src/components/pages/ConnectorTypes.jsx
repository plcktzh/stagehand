import { useQuery } from '@tanstack/react-query';
import { db, fetchAllAsArray } from '../../services/db';
import Spinner from '../layout/Spinner';
import { Fragment } from 'react';
import ErrorMessage from '../layout/ErrorMessage';
import { Pencil, PlusSquare } from '@phosphor-icons/react';

export default function ConnectorTypes() {
	const {
		data: connectorTypes = [],
		isError,
		isPending,
		isSuccess,
		error,
	} = useQuery({
		queryKey: ['connectorTypes'],
		queryFn: fetchAllConnectorTypesAsArray,
	});

	return (
		<div className="connector-types">
			{isPending && <Spinner />}
			{isError && <ErrorMessage error={error} />}
			{isSuccess && (
				<Fragment>
					<h2 className="page-title">Connector Types</h2>
					<ul className="cards">
						{connectorTypes.map((connectorType) => (
							<li key={connectorType.id} className="card">
								<h3 className="card__header">
									{connectorType.name}
									<button className="card__button card__button--edit">
										<Pencil weight="duotone" />
									</button>
								</h3>
								<div className="card__content">
									<h4 className="card__content__header">Type / Subtype:</h4>
									<p>
										{connectorType.type} / {connectorType.subtype.join(', ')}
									</p>
									<details>
										<summary>
											<h4 className="card__content__header">
												Permitted data / signal types:
											</h4>
										</summary>
										<ul className="data-types__specs">
											{connectorType.data.map((dataType) => (
												<Fragment key={dataType.id}>
													<li className="data-types__specs__item data-types__specs__item--highlight">
														{dataType.name}
													</li>
													{dataType.specs.map((spec) => (
														<li
															key={`${dataType.id}_${spec}`}
															className="data-types__specs__item"
														>
															{spec}
														</li>
													))}
												</Fragment>
											))}
										</ul>
									</details>
								</div>
							</li>
						))}
						<li className="card card--button-only">
							<button
								className="card__button card__button--add"
								ariaLabel="Add connector type"
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

async function fetchAllConnectorTypesAsArray({ queryKey }) {
	const connectorTypes = await fetchAllAsArray({ queryKey });
	const dataTypes = await fetchAllAsArray({ queryKey: ['dataTypes'] });

	connectorTypes.map((connectorType) => {
		connectorType.data = connectorType.data.map((connectorDataType) =>
			dataTypes.find((dataType) => dataType.id === connectorDataType)
		);

		return connectorType;
	});

	return connectorTypes;
}

// TODO: Add functions for adding and editing connector types
