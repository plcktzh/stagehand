import {
	addEdge,
	Background,
	Panel,
	ReactFlow,
	useEdgesState,
	useNodesState,
	useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/base.css';
import { useCallback, useState } from 'react';
import { buildDeviceNodesFromArray } from './data/devices';
import {
	useConnectorTypesContext,
	useDeviceCategoriesContext,
	useDevicesContext,
} from '../Stagehand';
import DeviceNode from './DeviceNode';
import { validateConnections } from './data/connections';

export default function SetupsFlow() {
	const devices = useDevicesContext();
	const deviceCategories = useDeviceCategoriesContext();
	const connectorTypes = useConnectorTypesContext();

	const initialNodes = buildDeviceNodesFromArray(
		devices,
		deviceCategories,
		connectorTypes
	);

	const nodeTypes = { device: DeviceNode };

	const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState([]);
	const [rfInstance, setRfInstance] = useState(null);
	const { setViewport } = useReactFlow();

	const onConnect = useCallback(
		(params) => setEdges((eds) => addEdge(params, eds)),
		[setEdges]
	);

	const isValidConnection = useCallback(
		({ source, sourceHandle, target, targetHandle }) => {
			const output = devices
				.find(({ id }) => id === source)
				.connectors.outputs.find(({ id }) => id === sourceHandle);
			output.connectorType = connectorTypes.find(
				({ id }) => id === output.connectorTypeId
			);
			const input = devices
				.find(({ id }) => id === target)
				.connectors.inputs.find(({ id }) => id === targetHandle);
			input.connectorType = connectorTypes.find(
				({ id }) => id === input.connectorTypeId
			);

			return validateConnections(output, input);
		}
	);

	const onSave = useCallback(() => {
		if (rfInstance) {
			const flow = rfInstance.toObject();
			localStorage.setItem('stagehand_temp', JSON.stringify(flow));
		}
	}, [rfInstance]);

	const onLoad = useCallback(() => {
		const restoreFlow = async () => {
			const flow = JSON.parse(localStorage.getItem('stagehand_temp'));
			if (flow) {
				const { x = 0, y = 0, zoom = 1 } = flow.viewport;
				setNodes(flow.nodes || []);
				setEdges(flow.edges || []);
				setViewport({ x, y, zoom });
			}
		};

		restoreFlow();
	}, [setNodes, setEdges, setViewport]);

	return (
		<ReactFlow
			nodes={nodes}
			edges={edges}
			nodeTypes={nodeTypes}
			onNodesChange={onNodesChange}
			onEdgesChange={onEdgesChange}
			onConnect={onConnect}
			onInit={setRfInstance}
			isValidConnection={isValidConnection}
			fitView
			fitViewOptions={{ padding: 2 }}
			style={{ backgroundColor: '#f0f0f0' }}
		>
			<Background />
			<Panel position="top-right">
				<button onClick={onSave}>Save Setup</button>
				<button onClick={onLoad}>Load Setup</button>
			</Panel>
		</ReactFlow>
	);
}
