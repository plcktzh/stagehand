import React from 'react';
import ReactDOM from 'react-dom/client';
import Stagehand from './components/Stagehand';
import Footer from './components/layout/Footer';
import Header from './components/layout/Header';

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
			<Header />
			<main className="site-content content-padding">
				<Stagehand />
			</main>
			<Footer />
	</React.StrictMode>
);
