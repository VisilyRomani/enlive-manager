export const statusColor = (status: string) => {
	switch (status) {
		case (status = 'PENDING'):
			return 'variant-ghost-secondary';
		case (status = 'SCHEDULED'):
			return 'variant-ghost-success';
		case (status = 'IN_PROGRESS'):
			return 'variant-ghost-success';
		case (status = 'COMPLETED'):
			return 'variant-ghost-success';
		case (status = 'CANCELED'):
			return 'variant-ghost-error';
		case (status = 'RESCHEUDLE'):
			return 'variant-ghost-warning';
		default:
			return 'variant-ghost-primary';
	}
};
