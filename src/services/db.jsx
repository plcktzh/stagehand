import Dexie from 'dexie';

export const db = new Dexie('stagehand');

// Initialize database tables
db.version(1).stores({
	connectorTypes: `id, name, data, type, subtype`,
	dataTypes: `id, name, specs`,
	devices: `++id, name, image, make, connections`,
});

export const initDb = async () => {
	if (window.localStorage.getItem('dbInitialized') === 'true') return true;
	else {
		// Setup basic data for connector and data types - this will likely remain static
		const connectorTypesJson = await (
			await fetch('/data/ConnectorTypes.json')
		).json();
		const dataTypesJson = await (await fetch('/data/DataTypes.json')).json();

		try {
			db.connectorTypes.bulkAdd(connectorTypesJson.connectorTypes);
			db.dataTypes.bulkAdd(dataTypesJson.dataTypes);
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
