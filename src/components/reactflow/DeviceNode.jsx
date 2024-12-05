import { Handle, Position } from '@xyflow/react';

export default function DeviceNode({ data, isConnectable }) {
	return (
		<div className={`device device--${data.category.id}`}>
			<div className="device__data device__drag-handle">
				<h2 className="device__data__header">
					<div
						className="icon"
						dangerouslySetInnerHTML={{ __html: data.category.icon }}
					></div>{' '}
					{data.label}
				</h2>
				Make: {data.longName}
				<br />
				Category: {data.category.name[0]}
			</div>
			<div className="device__connectors">
				<ul className="device__inputs">
					{data.connectors.inputs.map((input, index) => (
						<li className="device__connector" key={index}>
							<Handle
								id={input.id}
								type="target"
								position={Position.Left}
								isConnectable={isConnectable}
							/>
							{input.name}
						</li>
					))}
				</ul>

				<ul className="device__outputs">
					{data.connectors.outputs.map((output, index) => (
						<li className="device__connector" key={index}>
							{output.name}
							<Handle
								id={output.id}
								type="source"
								position={Position.Right}
								isConnectable={isConnectable}
							/>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}
