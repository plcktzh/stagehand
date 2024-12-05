export const buildDeviceNodesFromArray = (
	devices,
	deviceCategories,
	connectorTypes
) => {
	let col = 0,
		row = 0,
		previousCategory = '',
		previousHeightEstimate = 0;

	const nodes = devices
		.sort((a, b) => a.deviceCategoryId.localeCompare(b.deviceCategoryId))
		.map((device) => {
			if (device.deviceCategoryId !== previousCategory) {
				row = 0;
				col += 1;
				previousHeightEstimate = 0;
			}

			const deviceCategory = deviceCategories.find(
				({ id }) => id === device.deviceCategoryId
			);

			const node = {
				id: device.id,
				data: {
					label: device.name,
					longName: `${device.make.brand} ${device.make.model}${
						device.make.version ? ` ${device.make.version}` : ``
					}`,
					category: {
						id: device.deviceCategoryId,
						name: deviceCategory.name,
						icon: deviceCategory.icon,
					},
					connectors: {
						inputs: mapConnectors(device.connectors.inputs, connectorTypes),
						outputs: mapConnectors(device.connectors.outputs, connectorTypes),
					},
				},
				type: 'device',
				dragHandle: '.device__drag-handle',
				position: {
					x: col * 500,
					y: row++ * previousHeightEstimate,
				},
			};

			previousCategory = device.deviceCategoryId;
			previousHeightEstimate =
				225 +
				Math.max(
					device.connectors.inputs.length,
					device.connectors.outputs.length
				) *
					20;
			// 2: 100, 3: 112, 5: 140, 6: 153, 26: 430 --- 1 ~ 9px

			return node;
		});

	return nodes;
};

function mapConnectors(connectorsToMap, connectorTypes) {
	return connectorsToMap.map((connector) => {
		const connectorType = connectorTypes.find(
			({ id }) => id === connector.connectorTypeId
		);

		return {
			id: connector.id,
			name: connector.name,
			connector: connectorType,
			data: connectorType.dataType
				.filter(({ id }) =>
					connector.data.dataTypeId.some(
						(connectorDataTypeId) => connectorDataTypeId === id
					)
				)
				.map((dataType) => {
					return {
						id: dataType.id,
						name: dataType.name,
						specs: dataType.specs.filter((spec) =>
							connector.data.specs.some(
								(connectorSpec) => connectorSpec === spec
							)
						),
					};
				}),
		};
	});
}
