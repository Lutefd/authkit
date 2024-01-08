import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

interface FormErrorProps {
	error?: string;
}

function FormError({ error }: FormErrorProps) {
	if (!error) return null;
	return (
		<div className="bg-destructive/15 p-3 rounded-md  flex items-center gap-x-2 text-sm text-destructive">
			<FaExclamationTriangle className="h-4 w-4" />
			<p>{error}</p>
		</div>
	);
}

export default FormError;
