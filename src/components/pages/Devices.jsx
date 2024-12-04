import { useQuery } from '@tanstack/react-query';
import { fetchAllAsArray } from '../../services/db';
import Spinner from '../layout/Spinner';
import ErrorMessage from '../layout/ErrorMessage';
import { Fragment } from 'react';
import { Pencil, PlusSquare } from '@phosphor-icons/react';

export default function Devices() {
	const {
		data: [devices, deviceCategories, connectorTypes, dataTypes] = [[], [], []],
		isError,
		isPending,
		isSuccess,
		error,
	} = useQuery({
		queryKey: ['devices'],
		queryFn: fetchAllDevicesAsArray,
	});

	return (
		<div className="devices">
			{isPending && <Spinner />}
			{isError && <ErrorMessage error={error} />}
			{isSuccess && (
				<Fragment>
					<h1 className="page-title">Devices</h1>

					{deviceCategories.map((category) => {
						return (
							<Fragment key={category.id}>
								<h2 className="section-title">
									<div
										className="device-category__icon"
										dangerouslySetInnerHTML={{ __html: category.icon }}
									></div>
									{category.name[1]}
								</h2>

								<ul className="cards">
									{devices
										.filter(({ type }) => type === category.id)
										.map((device) => (
											<li key={device.id} className="card">
												<h3 className="card__header">
													{device.name}
													<button className="card__button card__button--edit">
														<Pencil weight="duotone" />
													</button>
												</h3>
												<div className="card__content">
													<p>
														{device.make.brand} {device.make.model}{' '}
														{device.make.version}
													</p>
													<details>
														<summary>
															<h4 className="card__content__header">Inputs:</h4>
														</summary>
														<table className="devices__connectors">
															<thead>
																<tr>
																	<th className="devices__connectors__col-name">
																		Name
																	</th>
																	<th className="devices__connectors__col-type">
																		Type
																	</th>
																	<th className="devices__connectors__col-data">
																		Data
																	</th>
																</tr>
															</thead>
															<tbody>
																{device.connectors.inputs.map((input) => (
																	<tr
																		key={input.id}
																		className="device__connectors__connector"
																	>
																		<td>
																			<span>
																				<strong>{input.name}</strong>
																			</span>
																		</td>
																		<td>
																			<span>
																				{
																					connectorTypes.find(
																						(connectorType) =>
																							connectorType.id ===
																							input.connector
																					).name
																				}
																			</span>
																		</td>
																		<td>
																			<ul className="data-types__specs data-types__specs--small">
																				{input.data.type.map(
																					(inputDataType) => (
																						<Fragment key={inputDataType}>
																							<li className="data-types__specs__item data-types__specs__item--highlight">
																								{
																									dataTypes.find(
																										(dataType) =>
																											dataType.id ===
																											inputDataType
																									).name
																								}
																							</li>
																							{input.data.specs
																								.filter((inputDataSpec) =>
																									dataTypes
																										.find(
																											(dataType) =>
																												dataType.id ===
																												inputDataType
																										)
																										.specs.some(
																											(spec) =>
																												spec === inputDataSpec
																										)
																								)
																								.map((spec) => (
																									<li
																										key={spec}
																										className="data-types__specs__item"
																									>
																										{spec}
																									</li>
																								))}
																						</Fragment>
																					)
																				)}
																			</ul>
																		</td>
																	</tr>
																))}
															</tbody>
														</table>
													</details>
													<details>
														<summary>
															<h4 className="card__content__header">
																Outputs:
															</h4>
														</summary>
														<table className="devices__connectors">
															<thead>
																<tr>
																	<th className="devices__connectors__col-name">
																		Name
																	</th>
																	<th className="devices__connectors__col-type">
																		Type
																	</th>
																	<th className="devices__connectors__col-data">
																		Data
																	</th>
																</tr>
															</thead>
															<tbody>
																{device.connectors.outputs.map((output) => (
																	<tr
																		key={output.id}
																		className="device__connectors__connector"
																	>
																		<td>
																			<span>
																				<strong>{output.name}</strong>
																			</span>
																		</td>
																		<td>
																			<span>
																				{
																					connectorTypes.find(
																						(connectorType) =>
																							connectorType.id ===
																							output.connector
																					).name
																				}
																			</span>
																		</td>
																		<td>
																			<ul className="data-types__specs data-types__specs--small">
																				{output.data.type.map(
																					(outputDataType) => (
																						<Fragment key={outputDataType}>
																							<li className="data-types__specs__item data-types__specs__item--highlight">
																								{
																									dataTypes.find(
																										(dataType) =>
																											dataType.id ===
																											outputDataType
																									).name
																								}
																							</li>
																							{output.data.specs
																								.filter((outputDataSpec) =>
																									dataTypes
																										.find(
																											(dataType) =>
																												dataType.id ===
																												outputDataType
																										)
																										.specs.some(
																											(spec) =>
																												spec === outputDataSpec
																										)
																								)
																								.map((spec) => (
																									<li
																										key={spec}
																										className="data-types__specs__item"
																									>
																										{spec}
																									</li>
																								))}
																						</Fragment>
																					)
																				)}
																			</ul>
																		</td>
																	</tr>
																))}
															</tbody>
														</table>
													</details>
													{/* 
									
									<details>
										<summary>
											<h4 className="card__content__header">
												Permitted data / signal types:
											</h4>
										</summary>
										<ul className="data-types__specs">
											{connectorType.data.map((dataType) => (
												<Fragment key={dataType.id}>
													<li className="data-types__specs__item data-types__specs__item--highlight">
														{dataType.name}
													</li>
													{dataType.specs.map((spec) => (
														<li
															key={`${dataType.id}_${spec}`}
															className="data-types__specs__item"
														>
															{spec}
														</li>
													))}
												</Fragment>
											))}
										</ul>
									</details>
									*/}
												</div>
											</li>
										))}
									<li className="card card--button-only">
										<button
											className="card__button card__button--add"
											aria-label="Add device"
										>
											<PlusSquare weight="duotone" />
										</button>
									</li>
								</ul>
							</Fragment>
						);
					})}
				</Fragment>
			)}
		</div>
	);
}

async function fetchAllDevicesAsArray({ queryKey }) {
	const devices = await fetchAllAsArray({ queryKey });
	const deviceCategories = await fetchAllAsArray({
		queryKey: ['deviceCategories'],
	});
	const connectorTypes = await fetchAllAsArray({
		queryKey: ['connectorTypes'],
	});
	const dataTypes = await fetchAllAsArray({ queryKey: ['dataTypes'] });

	return [devices, deviceCategories, connectorTypes, dataTypes];
}

// TODO: Add functions for adding and editing devices
