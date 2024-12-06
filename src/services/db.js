import Dexie from 'dexie';

export const db = new Dexie('stagehand');

// Initialize database tables
db.version(1).stores({
	connectorTypes: `id, name, dataTypeId, type, subtype`,
	dataTypes: `id, name, specs`,
	deviceCategories: `id, name, icon`,
	devices: `id, name, deviceCategoryId, make, connectors`,
	setups: `date, name, configuration`,
});

// Add initial JSON data to database tables
export const initDb = async () => {
	if (window.localStorage.getItem('dbInitialized') === 'true') return true;
	else {
		// Set up basic data for connector types, data types, device categories - this will likely remain static
		const connectorTypesJson = await (
			await fetch('/data/ConnectorTypes.json')
		).json();
		const dataTypesJson = await (await fetch('/data/DataTypes.json')).json();
		const deviceCategoriesJson = await (
			await fetch('/data/DeviceCategories.json')
		).json();
		// Set up basic data for devices - this will ideally be removed later
		const devicesJson = await (await fetch('/data/Devices.json')).json();

		try {
			db.connectorTypes.bulkAdd(connectorTypesJson.connectorTypes);
			db.dataTypes.bulkAdd(dataTypesJson.dataTypes);
			db.deviceCategories.bulkAdd(deviceCategoriesJson.deviceCategories);
			db.devices.bulkAdd(devicesJson.devices);
		} catch (err) {
			console.error(err);
			return false;
		}

		window.localStorage.setItem('dbInitialized', 'true');
		return true;
	}
};

// Fetch all entries for table queryKey[0] and return them as an Array
export const fetchAllAsArray = async ({ queryKey }) => {
	const data = await db.table(queryKey[0]).toArray();

	return data;
};

// Fetch all Data Types and return them as an Array
export const fetchDataTypes = async () => {
	const dataTypes = await fetchAllAsArray({ queryKey: ['dataTypes'] });
	return dataTypes;
};

// Fetch all Connector Types, map applicable Data Types and return everything as an Array
export const fetchConnectorTypes = async () => {
	const connectorTypes = await fetchAllAsArray({
		queryKey: ['connectorTypes'],
	});
	const dataTypes = await fetchDataTypes();

	return connectorTypes.map((connectorType) => {
		connectorType.dataType = connectorType.dataTypeId.map((dataTypeId) =>
			dataTypes.find((dataType) => dataType.id === dataTypeId)
		);

		return connectorType;
	});
};

// Fetch all Devices and return them as an Array
export const fetchDevices = async () => {
	const devices = await fetchAllAsArray({ queryKey: ['devices'] });
	return devices;
};

// Fetch all Device Categories and return them as an Array
export const fetchDeviceCategories = async () => {
	const deviceCategories = await fetchAllAsArray({
		queryKey: ['deviceCategories'],
	});
	return deviceCategories;
};

// Fetch all Setups and return them as an Array
export const fetchSetups = async () => {
	const setups = await fetchAllAsArray({ queryKey: ['setups'] });
	return setups;
};
