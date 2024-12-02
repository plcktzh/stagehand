import { ThreeDots } from 'react-loader-spinner';

export default function Spinner() {
	return (
		<ThreeDots
			visible={true}
			width="60"
			height="30"
			color="#131313"
			ariaLabel="three-dots-loading"
			wrapperClass="spinner"
		/>
	);
}
