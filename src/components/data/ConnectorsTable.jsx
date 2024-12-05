import { useConnectorTypesContext, useDataTypesContext } from '../Stagehand';
import DataTypeSpecsList from './DataTypeSpecsList';

export default function ConnectorsTable({ connectors }) {
	const connectorTypes = useConnectorTypesContext();

	return (
		<table className="devices__connectors">
			<thead>
				<tr>
					<th className="devices__connectors__col-name">Name</th>
					<th className="devices__connectors__col-type">Type</th>
					<th className="devices__connectors__col-data">Data</th>
				</tr>
			</thead>
			<tbody>
				{connectors.map((connector) => (
					<tr key={connector.id} className="device__connectors__connector">
						<td>
							<span>
								<strong>{connector.name}</strong>
							</span>
						</td>
						<td>
							<span>
								{
									connectorTypes.find(
										(connectorType) =>
											connectorType.id === connector.connectorTypeId
									).name
								}
							</span>
						</td>
						<td>
							<DataTypeSpecsList data={connector.data} isSmall />
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}
