import Dexie from 'dexie';

export const db = new Dexie('stagehand');

// Initialize database tables
db.version(1).stores({
	connectorTypes: `id, name, data, type, subtype`,
	dataTypes: `id, name, specs`,
	deviceCategories: `id, name, icon`,
	devices: `id, name, type, make, connectors`,
});

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

export const fetchAllAsArray = async ({ queryKey }) => {
	const data = await db.table(queryKey[0]).toArray();

	return data;
};
