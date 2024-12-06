export const buildDeviceNodesFromArray = (
    devices,
    deviceCategories,
    connectorTypes
) => {
    let col = 0,
        previousCategory = '';

    const nodes = devices
        .sort((a, b) => a.deviceCategoryId.localeCompare(b.deviceCategoryId))
        .map((device) => {
            if (device.deviceCategoryId !== previousCategory) {
                col += 1;
            }

            const deviceCategory = deviceCategories.find(
                ({
                    id
                }) => id === device.deviceCategoryId
            );

            const node = {
                id: device.id,
                data: {
                    id: device.id,
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
                    added: false
                },
                type: 'device',
                dragHandle: '.device__drag-handle',
                position: {
                    x: (Math.random() - .5) * window.innerWidth,
                    y: (Math.random() - .5) * window.innerHeight,
                },
            };

            previousCategory = device.deviceCategoryId;

            return node;
        });

    return nodes;
};

function mapConnectors(connectorsToMap, connectorTypes) {
    return connectorsToMap.map((connector) => {
        const connectorType = connectorTypes.find(
            ({
                id
            }) => id === connector.connectorTypeId
        );

        return {
            id: connector.id,
            name: connector.name,
            connector: connectorType,
            data: connectorType.dataType
                .filter(({
                        id
                    }) =>
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