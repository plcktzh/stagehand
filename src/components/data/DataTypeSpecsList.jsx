import { Fragment } from 'react';
import { useDataTypesContext } from '../Stagehand';

export default function DataTypeSpecsList({ data, isSmall = false }) {
	const dataTypes = useDataTypesContext();

	return (
		<ul
			className={`data-types__specs ${
				isSmall ? `data-types__specs--small` : ``
			}`}
		>
			{data.dataTypeId.map((connectorDataType) => (
				<Fragment key={connectorDataType}>
					<li className="data-types__specs__item data-types__specs__item--highlight">
						{
							dataTypes.find((dataType) => dataType.id === connectorDataType)
								.name
						}
					</li>
					{dataTypes
						.find((dataType) => dataType.id === connectorDataType)
						.specs.filter((spec) =>
							data.specs
								? data.specs.some((connectorSpec) => connectorSpec === spec)
								: spec
						)
						.map((spec) => (
							<li key={spec} className="data-types__specs__item">
								{spec}
							</li>
						))}
				</Fragment>
			))}
		</ul>
	);
}
