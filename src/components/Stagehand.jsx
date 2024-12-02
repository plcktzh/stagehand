import { Fragment, useEffect, useState } from 'react';
import { initDb } from '../services/db';
import { Route } from 'wouter';
import Home from './pages/Home';
import Setups from './pages/Setups';
import Devices from './pages/Devices';
import ConnectorTypes from './pages/ConnectorTypes';
import DataTypes from './pages/DataTypes';
import Spinner from './layout/Spinner';
import ErrorMessage from './layout/ErrorMessage';
import { useQuery } from '@tanstack/react-query';

export default function Stagehand() {
	const {
		data: dbInitialized = false,
		isError,
		isPending,
		isSuccess,
		error,
	} = useQuery({ queryKey: [], queryFn: initDb });

	return (
		<Fragment>
			{isPending && <Spinner />}
			{isError && <ErrorMessage error={error} />}
			{isSuccess && (
				<Fragment>
					<Route path="/" component={Home} />
					<Route path="/setups" component={Setups} />
					<Route path="/devices" component={Devices} />
					<Route path="/connector-types" component={ConnectorTypes} />
					<Route path="/data-types" component={DataTypes} />
				</Fragment>
			)}
		</Fragment>
	);
}
