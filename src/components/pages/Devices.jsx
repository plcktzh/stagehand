import { Fragment } from 'react';
import { PlusSquare } from '@phosphor-icons/react';
import { useDeviceCategoriesContext, useDevicesContext } from '../Stagehand';
import Card from '../layout/Card';
import ConnectorsTable from '../data/ConnectorsTable';
import CardButton from '../layout/CardButton';

export default function Devices() {
	const devices = useDevicesContext();
	const deviceCategories = useDeviceCategoriesContext();

	return (
		<main className="site-content content-padding devices">
			<h1 className="page-title">Devices</h1>
			{deviceCategories.map((deviceCategory) => (
				<Fragment key={deviceCategory.id}>
					<h2 className="section-title">
						<div
							className="device-category__icon"
							dangerouslySetInnerHTML={{ __html: deviceCategory.icon }}
						></div>
						{deviceCategory.name[1]}
					</h2>
					<ul className="cards">
						{devices
							.filter(
								({ deviceCategoryId }) => deviceCategoryId === deviceCategory.id
							)
							.map((device) => (
								<li key={device.id}>
									<Card title={device.name} headingLevel="3">
										<p>
											{device.make.brand} {device.make.model}{' '}
											{device.make.version}
										</p>
										{device.connectors.inputs.length > 0 && (
											<details>
												<summary>
													<h4 className="card__content__header">Inputs:</h4>
												</summary>
												<ConnectorsTable
													connectors={device.connectors.inputs}
												/>
											</details>
										)}
										{device.connectors.outputs.length > 0 && (
											<details>
												<summary>
													<h4 className="card__content__header">Outputs:</h4>
												</summary>
												<ConnectorsTable
													connectors={device.connectors.outputs}
												/>
											</details>
										)}
									</Card>
								</li>
							))}
					</ul>
					<CardButton
						label="Add Device"
						icon={<PlusSquare weight="duotone" />}
						onClickHandler={() => {
							console.log('Add Device');
						}}
					/>
				</Fragment>
			))}
		</main>
	);
}

// TODO: Add functions for adding and editing devices
