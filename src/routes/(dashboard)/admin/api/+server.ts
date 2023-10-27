// import { GOOGLE_MAPS } from '$env/static/private';
// import { Client, PlaceAutocompleteType } from '@googlemaps/google-maps-services-js';
// export const GET = async ({ url }) => {
// 	const address = url.searchParams.get('address');
// 	const client = new Client();
// 	let autocomplete = new google.maps.places.Autocomplete({});

// 	// const result = await client.placeAutocomplete({
// 	// 	params: {
// 	// 		input: address ?? '',
// 	// 		components: ['country:ca'],

// 	// 		key: GOOGLE_MAPS,
// 			// types: PlaceAutocompleteType.address
// 	// 	}
// 	// });

// 	if (result.data.status === 'OK') {
// 		return new Response(JSON.stringify({ result: result.data.predictions }));
// 	} else {
// 		return new Response();
// 	}
// };
