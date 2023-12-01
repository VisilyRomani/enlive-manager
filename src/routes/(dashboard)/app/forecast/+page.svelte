<script lang="ts">
	const getLocation = () => {
		navigator.geolocation.getCurrentPosition(
			async (position) => {
				const apiString = `https://api.open-meteo.com/v1/forecast?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&hourly=temperature_2m`;
				const result = await fetch(apiString, { method: 'GET' });
				const temp = await result.json();
			},

			(error) => {
				console.error(error);
			}
		);
	};
</script>
