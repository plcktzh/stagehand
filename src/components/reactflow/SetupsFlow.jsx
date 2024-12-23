import {
	addEdge,
	Background,
	Controls,
	getConnectedEdges,
	getIncomers,
	getOutgoers,
	MiniMap,
	Panel,
	ReactFlow,
	reconnectEdge,
	useEdgesState,
	useNodesInitialized,
	useNodesState,
	useReactFlow,
	useStoreApi,
} from '@xyflow/react';
import '@xyflow/react/dist/base.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import { buildDeviceNodesFromArray } from './data/devices';
import {
	useConnectorTypesContext,
	useDeviceCategoriesContext,
	useDevicesContext,
} from '../Stagehand';
import DeviceNode from './DeviceNode';
import { validateConnections } from './data/connections';
import { FloppyDisk, FolderOpen, PlusSquare } from '@phosphor-icons/react';
import { db, fetchSetups } from '../../services/db';
import { useLiveQuery } from 'dexie-react-hooks';

const nodeClassName = (node) => node.type;

export default function SetupsFlow() {
	const devices = useDevicesContext();
	const deviceCategories = useDeviceCategoriesContext();
	const connectorTypes = useConnectorTypesContext();

	const [deviceNodes, setDeviceNodes] = useState(() => buildDeviceNodesFromArray(
		devices,
		deviceCategories,
		connectorTypes
	));

	const nodeTypes = { device: DeviceNode };
	const store = useStoreApi();
	const edgeReconnectSuccessful = useRef(true);
	const [nodes, setNodes, onNodesChange] = useNodesState([]);
	const [edges, setEdges, onEdgesChange] = useEdgesState([]);
	const [rfInstance, setRfInstance] = useState(null);
	const { setViewport, getInternalNode } = useReactFlow();
	const [selectedDevice, setSelectedDevice] = useState('');
	const [setupName, setSetupName] = useState('Untitled Setup');
	const [loadedSetup, setLoadedSetup] = useState('');
	const savedSetups = useLiveQuery(fetchSetups, []);

	const onConnect = useCallback(
		(params) => setEdges((eds) => addEdge(params, eds)),
		[setEdges]
	);

	const MIN_DISTANCE = 150;

	// Taken verbatim from https://reactflow.dev/examples/nodes/proximity-connect
	const getClosestEdge = useCallback((node) => {
		const { nodeLookup } = store.getState();
		const internalNode = getInternalNode(node.id);

		const closestNode = Array.from(nodeLookup.values()).reduce(
			(res, n) => {
				if (n.id !== internalNode.id) {
					const dx =
						n.internals.positionAbsolute.x -
						internalNode.internals.positionAbsolute.x;
					const dy =
						n.internals.positionAbsolute.y -
						internalNode.internals.positionAbsolute.y;
					const d = Math.sqrt(dx * dx + dy * dy);

					if (d < res.distance && d < MIN_DISTANCE) {
						res.distance = d;
						res.node = n;
					}
				}

				return res;
			},
			{
				distance: Number.MAX_VALUE,
				node: null,
			}
		);

		if (!closestNode.node) {
			return null;
		}

		const closeNodeIsSource =
			closestNode.node.internals.positionAbsolute.x <
			internalNode.internals.positionAbsolute.x;

		return {
			id: closeNodeIsSource
				? `${closestNode.node.id}-${node.id}`
				: `${node.id}-${closestNode.node.id}`,
			source: closeNodeIsSource ? closestNode.node.id : node.id,
			target: closeNodeIsSource ? node.id : closestNode.node.id,
		};
	}, []);

	// Taken verbatim from https://reactflow.dev/examples/nodes/proximity-connect
	const onNodeDrag = useCallback(
		(_, node) => {
			const closeEdge = getClosestEdge(node);

			setEdges((es) => {
				const nextEdges = es.filter((e) => e.className !== 'temp');

				if (
					closeEdge &&
					!nextEdges.find(
						(ne) =>
							ne.source === closeEdge.source && ne.target === closeEdge.target
					)
				) {
					closeEdge.className = 'temp';
					nextEdges.push(closeEdge);
				}

				return nextEdges;
			});
		},
		[getClosestEdge, setEdges]
	);

	// Taken verbatim from https://reactflow.dev/examples/nodes/proximity-connect
	const onNodeDragStop = useCallback(
		(_, node) => {
			const closeEdge = getClosestEdge(node);

			setEdges((es) => {
				const nextEdges = es.filter((e) => e.className !== 'temp');

				if (
					closeEdge &&
					!nextEdges.find(
						(ne) =>
							ne.source === closeEdge.source && ne.target === closeEdge.target
					)
				) {
					nextEdges.push(closeEdge);
				}

				return nextEdges;
			});
		},
		[getClosestEdge]
	);

	// Taken verbatim from https://reactflow.dev/examples/edges/delete-edge-on-drop
	const onReconnectStart = useCallback(() => {
		edgeReconnectSuccessful.current = false;
	}, []);

	// Taken verbatim from https://reactflow.dev/examples/edges/delete-edge-on-drop
	const onReconnect = useCallback((oldEdge, newConnection) => {
		edgeReconnectSuccessful.current = true;
		setEdges((els) => reconnectEdge(oldEdge, newConnection, els));
	}, []);

	// Taken verbatim from https://reactflow.dev/examples/edges/delete-edge-on-drop
	const onReconnectEnd = useCallback((_, edge) => {
		if (!edgeReconnectSuccessful.current) {
			setEdges((eds) => eds.filter((e) => e.id !== edge.id));
		}

		edgeReconnectSuccessful.current = true;
	}, []);

	const isValidConnection = useCallback(
		({ source, sourceHandle, target, targetHandle }) => {
			const output = devices
				.find(({ id }) => id === source)
				.connectors.outputs.find(({ id }) => id === sourceHandle);
			if (output) output.connectorType = connectorTypes.find(
				({ id }) => id === output.connectorTypeId
			);
			const input = devices
				.find(({ id }) => id === target)
				.connectors.inputs.find(({ id }) => id === targetHandle);
			if (input) input.connectorType = connectorTypes.find(
				({ id }) => id === input.connectorTypeId
			);

			return source !== target && validateConnections(output, input);
		}
	);

	// Taken verbatim from https://reactflow.dev/examples/nodes/delete-middle-node
	const onNodesDelete = useCallback((deleted) => {
		setEdges(
			deleted.reduce((acc, node) => {
				const incomers = getIncomers(node, nodes, edges);
				const outgoers = getOutgoers(node, nodes, edges);
				const connectedEdges = getConnectedEdges([node], edges);

				const remainingEdges = acc.filter((edge) => !connectedEdges.includes(edge));

				const createdEdges = incomers.flatMap(({ id: source }) => outgoers.map(({ id: target }) => ({
					id: `${source}->${target}`,
					source,
					target
				})),
			);
			setDeviceNodes(deviceNodes.map((device) => { 
				if (device.id === node.id) {
					device.data.added = false;
				}
				return device; 
			}));

			return [...remainingEdges, ...createdEdges];
			}, edges),
		);
	}, [nodes, edges]);

	const onAddDevice = useCallback(() => {
		const deviceNode = deviceNodes.find(({id}) => id === selectedDevice);

		if (deviceNode.data.added === true) return;
		else {
			setNodes([...nodes, deviceNode]);
			setDeviceNodes(deviceNodes.map((device) => { 
				if (device.id === selectedDevice) {
					device.data.added = true;
				}
				return device; 
			}));
		}
	}, [selectedDevice, setDeviceNodes, deviceNodes, setNodes, nodes]);

	const onSave = useCallback(() => {
		if (rfInstance) {
			db.setups.put({
				date: new Date().toUTCString(),
				name: setupName,
				configuration: JSON.stringify(rfInstance.toObject()),
			});
		}
	}, [rfInstance, setupName]);

	const onLoad = useCallback(() => {
		const restoreFlow = async () => {
			const setup = await db.setups.get({ date: loadedSetup });
			const flow = JSON.parse(setup.configuration);

			if (flow) {
				const { x = 0, y = 0, zoom = 1 } = flow.viewport;
				setNodes(flow.nodes.map(node => {
					setDeviceNodes(deviceNodes.map((device) => { 
						if (device.id === node.id) {
							device.data.added = true;
						}
						return device; 
					}));
					return node;
				}) || []);
				setEdges(flow.edges || []);
				setViewport({ x, y, zoom });

				setSetupName(setup.name);
			}
		};

		if (loadedSetup !== '') restoreFlow();
	}, [setNodes, setEdges, setViewport, setSetupName, loadedSetup]);

	return (
		<ReactFlow
			nodes={nodes}
			edges={edges}
			nodeTypes={nodeTypes}
			onNodesChange={onNodesChange}
			onNodesDelete={onNodesDelete}
			onEdgesChange={onEdgesChange}
			onNodeDrag={onNodeDrag}
			onNodeDragStop={onNodeDragStop}
			onReconnect={onReconnect}
			onReconnectStart={onReconnectStart}
			onReconnectEnd={onReconnectEnd}
			onConnect={onConnect}
			onInit={setRfInstance}
			isValidConnection={isValidConnection}
			fitView
			fitViewOptions={{ padding: 2 }}
			style={{ backgroundColor: '#f0f0f0' }}
			snapToGrid={true}
		>
			<Background />
			<Panel position="top-right" className="setups__control-panel">
				<fieldset>
					<label htmlFor="device" hidden>
						Device:
					</label>
					<select
						id="device"
						defaultValue=""
						onChange={(e) => setSelectedDevice(e.target.value)}
					>
						<option value="">Choose a device to add ...</option>
						{deviceNodes &&
							deviceNodes.filter(({ data }) => !data.added).sort((a, b) => b.deviceCategoryId > a.deviceCategoryId).map((device) => (
								<option key={device.id} value={device.id}>
									{device.data.label}
								</option>
							))}
					</select>
					<button onClick={onAddDevice} aria-label="Add Device">
						<PlusSquare weight="duotone" size="16" />
					</button>
				</fieldset>
				<fieldset>
					<label htmlFor="name" hidden>
						Name:
					</label>
					<input
						type="text"
						id="name"
						value={setupName}
						onChange={(e) => setSetupName(e.target.value)}
					/>
					<button onClick={onSave} aria-label="Save Setup">
						<FloppyDisk weight="duotone" size="16" />
					</button>
				</fieldset>
				<fieldset>
					<label htmlFor="savedSetups" hidden>
						Saved Setups:
					</label>
					<select
						id="savedSetups"
						defaultValue={loadedSetup}
						onChange={(e) => setLoadedSetup(e.target.value)}
					>
						<option value="">Choose a saved setup ...</option>
						{savedSetups &&
							savedSetups.sort((a, b) => b.date > a.date).map((setup) => (
								<option key={`${setup.name}_${setup.date}`} value={setup.date}>
									{setup.date} – {setup.name}
								</option>
							))}
					</select>
					<button onClick={onLoad} aria-label="Load Setup">
						<FolderOpen weight="duotone" size="16" />
					</button>
				</fieldset>
			</Panel>
			<MiniMap zoomable pannable nodeClassName={nodeClassName} />
			<Controls />
		</ReactFlow>
	);
}
