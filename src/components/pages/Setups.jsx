import { ReactFlowProvider } from '@xyflow/react';
import SetupsFlow from '../reactflow/SetupsFlow';

// As per https://reactflow.dev/examples/interaction/save-and-restore
// The Save & Restore workflow doesn't seem to work with SetupsFlow's JSX being returned directly from within Setups
export default function Setups() {
	return (
		<ReactFlowProvider>
			<SetupsFlow />
		</ReactFlowProvider>
	);
}
