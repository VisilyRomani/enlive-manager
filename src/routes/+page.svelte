<script lang="ts">
	import people from '$lib/photos/people.svg?raw';
	import charts from '$lib/photos/charts.svg?raw';
	import payment from '$lib/photos/payment.svg?raw';
</script>

<svelte:head>
	<meta name="robots" content="noindex nofollow" />
	<title>Enlive Manager</title>
</svelte:head>

<div class="w-full my-40 flex justify-center items-center flex-col">
	<div class="space-y-10 text-center flex flex-col items-center max-w-2xl">
		<h2 class="h1">An Efficient Way To Manage Your Buisness</h2>
		<p>
			Unlock the Power of Relationship Intelligence: Seamlessly Navigate Your Path to Success with
			Precision, Purpose, and Personalized Client Relations Management
		</p>
		<a class="btn btn-lg variant-ghost-primary" href="/login">Start your buisness today</a>
	</div>
</div>

<div class="flex flex-row gap-10 justify-center my-40 flex-wrap">
	<div class="card p-5 max-w-[20em] space-y-5 flex flex-col justify-items-center text-center">
		<h4 class="h4">Clients</h4>
		<svg class="mx-auto fill-secondary-500" width="5em" viewBox="0 0 24 24">{@html people}</svg>
		<p>
			Enhanced client management with simplified task delegation, interaction tracking, and
			insightful analytics.
		</p>
	</div>
	<div class="card p-5 max-w-[20em] space-y-5 flex flex-col justify-items-center text-center">
		<h4 class="h4">Invoicing</h4>
		<svg class="mx-auto fill-secondary-500" width="5em" viewBox="0 0 24 24">{@html payment}</svg>
		<p>
			Effortlessly invoice with our one click solution for quicker payments and improved financial
			efficiency.
		</p>
	</div>
	<div class="card p-5 max-w-[20em] space-y-5 flex flex-col justify-items-center text-center">
		<h4 class="h4">Finance</h4>
		<svg class="mx-auto fill-secondary-500" width="5em" viewBox="0 0 24 24">{@html charts}</svg>
		<p>
			Empower you to efficiently monitor and analyze financial data, ensuring informed
			decision-making and stronger client relationships.
		</p>
	</div>
</div>

<div class="bg-primary-500 w-full flex flex-col gap-5 justify-center p-20 text-center">
	<h1 class="h1 text-gray-900">Get Started Today</h1>
	<p class="text-gray-800 text-xl h5">Manage your buisness quickly and easily.</p>
	<a href="/signup" class="btn btn-xl variant-filled-tertiary !bg-gray-900">Start Here</a>
</div>

<div class="card w-full flex flex-wrap justify-around">
	<div class="flex flex-col m-5">
		<h5 class="h5">Who we are</h5>
		<a href="/" class="text-gray-500">About us</a>
	</div>
	<div class="flex flex-col m-5">
		<h5 class="h5">Support</h5>
		<a href="/" class="text-gray-500">Contact us</a>
	</div>
	<div class="flex flex-col m-5 justify-center">
		<h5 class="h5">Policies</h5>
		<a href="/" class="text-gray-500">Terms and conditions</a>
		<a href="/" class="text-gray-500">Privacy policy</a>
	</div>
	<div class="flex flex-col m-5">
		<h5 class="h5">Resources</h5>
		<a href="/" class="text-gray-500">Documentation</a>
	</div>
</div>
