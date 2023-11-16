export const haversine = (latOne: number, lngOne: number, latTwo: number, lngTwo: number) => {
	const r_latOne = (latOne * Math.PI) / 180;
	const r_latTwo = (latTwo * Math.PI) / 180;

	const earthRadius = 6371;

	const deltaLat = (latTwo - latOne) * (Math.PI / 180);
	const deltaLng = (lngTwo - lngOne) * (Math.PI / 180);

	const a =
		Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
		Math.cos(r_latOne) * Math.cos(r_latTwo) * Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);

	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

	return earthRadius * c;
};
