import { useQuery } from '@tanstack/react-query';
import { db, fetchAllAsArray } from '../../services/db';
import Spinner from '../layout/Spinner';
import { Fragment } from 'react';
import ErrorMessage from '../layout/ErrorMessage';

export default function ConnectorTypes() {
	const {
		data: connectorTypes = [],
		isError,
		isPending,
		isSuccess,
		error,
	} = useQuery({
		queryKey: ['connectorTypes'],
		queryFn: fetchAllAsArray,
	});

	return (
		<Fragment>
			{isPending && <Spinner />}
			{isError && <ErrorMessage error={error} />}
			{isSuccess && (
				<ul>
					{connectorTypes.map((connectorType) => (
						<li key={connectorType.id}>
							<strong>{connectorType.name}</strong>
							<br />
							Type: {connectorType.type}
							<br />
							Subtype: {connectorType.subtype.join(', ')}
							<br />
							Valid data: {connectorType.data.join(', ')}
						</li>
					))}
				</ul>
			)}
		</Fragment>
	);
}
