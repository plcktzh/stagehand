import { useQuery } from '@tanstack/react-query';
import { db, fetchAllAsArray } from '../../services/db';
import Spinner from '../layout/Spinner';
import { Fragment } from 'react';
import ErrorMessage from '../layout/ErrorMessage';

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
		<Fragment>
			{isPending && <Spinner />}
			{isError && <ErrorMessage error={error} />}
			{isSuccess && (
				<ul>
					{dataTypes.map((dataType) => (
						<li key={dataType.id}>
							{dataType.name}
							<ul>
								{dataType.specs.map((spec) => (
									<li key={spec}>{spec}</li>
								))}
							</ul>
						</li>
					))}
				</ul>
			)}
		</Fragment>
	);
}
