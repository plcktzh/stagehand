import {
	addEdge,
	Background,
	Controls,
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

const nodeClassName = (node) => node.type;

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
	const store = useStoreApi();
	const edgeReconnectSuccessful = useRef(true);
	const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState([]);
	const [rfInstance, setRfInstance] = useState(null);
	const { setViewport, getInternalNode, getNodes, updateNode } = useReactFlow();
	const nodesInitialized = useNodesInitialized({ includeHiddenNodes: false });

	const onConnect = useCallback(
		(params) => setEdges((eds) => addEdge(params, eds)),
		[setEdges]
	);

	useEffect(() => {
		if (nodesInitialized) {
			const nodes = getNodes();

			let previousCategory,
				previousNodePosition = 0,
				previousNodeHeight = 0;

			for (const node of nodes) {
				if (previousCategory !== node.data.category.id) {
					previousCategory = undefined;
					previousNodePosition = 0;
					previousNodeHeight = 0;
				}
				const newYPosition =
					previousNodeHeight > 0
						? previousNodePosition + previousNodeHeight + 50
						: 0;

				updateNode(node.id, {
					position: { x: node.position.x, y: newYPosition },
				});

				previousCategory = node.data.category.id;
				previousNodePosition = newYPosition;
				previousNodeHeight = node.measured.height;
			}
		}
	}, [nodesInitialized]);

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
			<Panel position="top-right">
				<button onClick={onSave}>Save Setup</button>
				<button onClick={onLoad}>Load Setup</button>
			</Panel>
			<MiniMap zoomable pannable nodeClassName={nodeClassName} />
			<Controls />
		</ReactFlow>
	);
}
