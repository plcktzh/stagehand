import { useQuery } from '@tanstack/react-query';
import { fetchAllAsArray } from '../../services/db';
import Spinner from '../layout/Spinner';
import ErrorMessage from '../layout/ErrorMessage';
import { Fragment } from 'react';
import { Pencil, PlusSquare } from '@phosphor-icons/react';
import { useDeviceCategoriesContext } from '../Stagehand';
import Card from '../layout/Card';
import CardButton from '../layout/CardButton';

export default function DeviceCategories() {
	const deviceCategories = useDeviceCategoriesContext();

	return (
		<div className="device-categories">
			<h1 className="page-title">Device Categories</h1>
			<ul className="cards">
				{deviceCategories.map((deviceCategory) => (
					<li key={deviceCategory.id}>
						<Card title={deviceCategory.name[0]} headlingLevel="2">
							<div
								className="device-category__icon"
								dangerouslySetInnerHTML={{ __html: deviceCategory.icon }}
							></div>
						</Card>
					</li>
				))}
			</ul>
			<CardButton
				label="Add Device Category"
				icon={<PlusSquare weight="duotone" />}
				onClickHandler={() => {
					console.log('Add Device Category');
				}}
			/>
		</div>
	);
}

// TODO: Add functions for adding and editing data types
