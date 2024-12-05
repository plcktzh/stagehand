import React from 'react';
import ReactDOM from 'react-dom/client';
import Stagehand from './components/Stagehand';
import Footer from './components/layout/Footer';
import Header from './components/layout/Header';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60,
			gcTime: 1000 * 60,
		},
	},
});

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<Header />
			<Stagehand />
			<Footer />
		</QueryClientProvider>
	</React.StrictMode>
);
