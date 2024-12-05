import { useQuery } from '@tanstack/react-query';
import { db, fetchAllAsArray } from '../../services/db';
import Spinner from '../layout/Spinner';
import { Fragment } from 'react';
import ErrorMessage from '../layout/ErrorMessage';
import { Pencil, PlusSquare } from '@phosphor-icons/react';
import { useDataTypesContext } from '../Stagehand';
import Card from '../layout/Card';
import CardButton from '../layout/CardButton';
import DataTypeSpecsList from '../data/DataTypeSpecsList';

export default function DataTypes() {
	const dataTypes = useDataTypesContext();

	return (
		<main className="site-content content-padding data-types">
			<h1 className="page-title">Data Types</h1>
			<ul className="cards">
				{dataTypes.map((dataType) => (
					<li key={dataType.id}>
						<Card title={dataType.name} headingLevel="2">
							<h3 className="card__content__header">Permitted data types:</h3>
							<ul className="data-types__specs">
								{dataType.specs.map((spec) => (
									<li key={spec} className="data-types__specs__item">
										{spec}
									</li>
								))}
							</ul>
						</Card>
					</li>
				))}
			</ul>
			<CardButton
				label="Add Data Type"
				icon={<PlusSquare weight="duotone" />}
				onClickHandler={() => {
					console.log('Add Data Type');
				}}
			/>
		</main>
	);
}

// TODO: Add functions for adding and editing data types
