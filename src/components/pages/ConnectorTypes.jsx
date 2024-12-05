import { PlusSquare } from '@phosphor-icons/react';
import { useConnectorTypesContext } from '../Stagehand';
import CardButton from '../layout/CardButton';
import Card from '../layout/Card';
import DataTypeSpecsList from '../data/DataTypeSpecsList';

export default function ConnectorTypes() {
	const connectorTypes = useConnectorTypesContext();

	return (
		<div className="connector-types">
			<h1 className="page-title">Connector Types</h1>
			<ul className="cards">
				{connectorTypes.map((connectorType) => (
					<li key={connectorType.id}>
						<Card title={connectorType.name} headingLevel="2">
							<h3 className="card__content__header">Type / Subtype:</h3>
							<p>
								{connectorType.type} / {connectorType.subtype.join(', ')}
							</p>
							<details>
								<summary>
									<h4 className="card__content__header">
										Permitted Data Types:
									</h4>
								</summary>
								<DataTypeSpecsList data={connectorType} />
							</details>
						</Card>
					</li>
				))}
			</ul>
			<CardButton
				label="Add Connector Type"
				icon={<PlusSquare weight="duotone" />}
				onClickHandler={() => {
					console.log('Add Connector Type');
				}}
			/>
		</div>
	);
}

// TODO: Add functions for adding and editing connector types
