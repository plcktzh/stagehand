export const validateConnections = (output, input) => {
	const outputDataType = output.data.dataTypeId;
	const inputDataType = input.data.dataTypeId;
	const matchedDataType =
		inputDataType.filter((dataType) => outputDataType.includes(dataType))
			.length > 0;

	const outputCompatibleConnectors =
		output.connectorType.compatibleConnectorTypeId;
	const inputCompatibleConnectors =
		input.connectorType.compatibleConnectorTypeId;
	const matchedCompatibleConnectors =
		inputCompatibleConnectors.filter((compatibleConnector) =>
			outputCompatibleConnectors.includes(compatibleConnector)
		).length > 0;

	return matchedDataType && matchedCompatibleConnectors;
};
