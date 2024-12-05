import { createContext, Fragment, useContext } from 'react';
import {
	fetchConnectorTypes,
	fetchDataTypes,
	fetchDeviceCategories,
	fetchDevices,
	fetchSetups,
	initDb,
} from '../services/db';
import { Route } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import Home from './pages/Home';
import Setups from './pages/Setups';
import Devices from './pages/Devices';
import ConnectorTypes from './pages/ConnectorTypes';
import DataTypes from './pages/DataTypes';
import Spinner from './layout/Spinner';
import ErrorMessage from './layout/ErrorMessage';
import DeviceCategories from './pages/DeviceCategories';
import { useLiveQuery } from 'dexie-react-hooks';

const DeviceCategoriesContext = createContext(null);
const DataTypesContext = createContext(null);
const ConnectorTypesContext = createContext(null);
const DevicesContext = createContext(null);
const SetupsContext = createContext(null);

export function useDeviceCategoriesContext() {
	return useContext(DeviceCategoriesContext);
}

export function useDataTypesContext() {
	return useContext(DataTypesContext);
}

export function useConnectorTypesContext() {
	return useContext(ConnectorTypesContext);
}

export function useDevicesContext() {
	return useContext(DevicesContext);
}

export function useSetupsContext() {
	return useContext(SetupsContext);
}

export default function Stagehand() {
	const {
		data: dbInitialized = false,
		isError,
		isPending,
		isSuccess,
		error,
	} = useQuery({ queryKey: ['init'], queryFn: initDb });

	const deviceCategories = useLiveQuery(fetchDeviceCategories, []);
	const dataTypes = useLiveQuery(fetchDataTypes, []);
	const connectorTypes = useLiveQuery(fetchConnectorTypes, []);
	const devices = useLiveQuery(fetchDevices, []);
	const setups = useLiveQuery(fetchSetups, []);

	return (
		<main className="site-content content-padding">
			{isPending && <Spinner />}
			{isError && <ErrorMessage error={error} />}
			{isSuccess && (
				<Fragment>
					{deviceCategories && (
						<DeviceCategoriesContext.Provider value={deviceCategories}>
							<Fragment>
								{dataTypes && (
									<DataTypesContext.Provider value={dataTypes}>
										<Fragment>
											{connectorTypes && (
												<ConnectorTypesContext.Provider value={connectorTypes}>
													<Fragment>
														{devices && (
															<DevicesContext.Provider value={devices}>
																<Fragment>
																	{setups && (
																		<SetupsContext.Provider value={setups}>
																			<Route path="/" component={Home} />
																			<Route
																				path="/setups"
																				component={Setups}
																			/>
																			<Route
																				path="/devices"
																				component={Devices}
																			/>
																			<Route
																				path="/device-categories"
																				component={DeviceCategories}
																			/>
																			<Route
																				path="/connector-types"
																				component={ConnectorTypes}
																			/>
																			<Route
																				path="/data-types"
																				component={DataTypes}
																			/>
																		</SetupsContext.Provider>
																	)}
																</Fragment>
															</DevicesContext.Provider>
														)}
													</Fragment>
												</ConnectorTypesContext.Provider>
											)}
										</Fragment>
									</DataTypesContext.Provider>
								)}
							</Fragment>
						</DeviceCategoriesContext.Provider>
					)}
				</Fragment>
			)}
		</main>
	);
}
