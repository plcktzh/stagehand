import { Fragment, useEffect, useState } from 'react';
import { initDb } from '../services/db';
import { ThreeDots } from 'react-loader-spinner';
import { Route } from 'wouter';
import Home from './pages/Home';
import Setups from './pages/Setups';
import Devices from './pages/Devices';
import ConnectorTypes from './pages/ConnectorTypes';
import DataTypes from './pages/DataTypes';

export default function Stagehand() {
	const [dbInitialized, setDbInitialized] = useState(false);

	useEffect(() => {
		(async () => {
			setDbInitialized(await initDb());
		})();
	}, [dbInitialized, setDbInitialized]);

	return dbInitialized ? (
		<Fragment>
			<Route path="/" component={Home} />
			<Route path="/setups" component={Setups} />
			<Route path="/devices" component={Devices} />
			<Route path="/connector-types" component={ConnectorTypes} />
			<Route path="/data-types" component={DataTypes} />
		</Fragment>
	) : (
		<ThreeDots
			visible={true}
			width="60"
			height="30"
			color="#131313"
			ariaLabel="three-dots-loading"
			wrapperClass="spinner"
		/>
	);
}
