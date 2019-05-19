<!-- https://eugenkiss.github.io/7guis/tasks#crud -->


<script>
  import { initSafe, isSafeInitialised, getPeople, getItems } from './safe-api'
  initSafe();

	let people = [
		{
			first: 'SAFE3',
			last: 'Network'
		},
		{
			first: 'Max',
			last: 'Mustermann'
		},
		{
			first: 'Roman',
			last: 'Tisch'
		}
	];

  people = getPeople();
  $: people = getPeople();

  let items = []
  $: items = (isSafeInitialised() ? getItems() : []);
  $: n = items.length;

	let prefix = '';
	let first = '';
	let last = '';
	let i = 0;

	$: filteredPeople = prefix
		? people.filter(person => {
			const name = `${person.last}, ${person.first}`;
			return name.toLowerCase().startsWith(prefix.toLowerCase());
		})
		: people;

	$: selected = filteredPeople[i];

	$: {
		first = selected ? selected.first : '';
		last = selected ? selected.last : '';
	}

	function create() {
		people = people.concat({ first, last });
		i = people.length - 1;
		first = last = '';
	}

	function update() {
		people[i] = { first, last };
	}

	function remove() {
		people = [...people.slice(0, i), ...people.slice(i + 1)];

		first = last = '';
		i = Math.min(i, people.length - 1);
	}

	function reset_inputs(person) {
		({ first, last } = person);
	}
</script>

<style>
	* {
		font-family: inherit;
		font-size: inherit;
	}

  .content {
    margin: 0 0 1em 2em;
  }

  h1 { text-align: left;}

	input {
		display: block;
		margin: 1em 0 0.5em 0;
	}

	select {
		float: left;
		margin: 0 1em 1em 0;
		width: 14em;
	}

	.buttons {
		clear: both;
	}
</style>

<svelte:head>
  <title>Svelte on SAFE</title>
</svelte:head>

<div class='content'>
  <h1>SAFE Web App Tutorial example using Svelte</h1>
  <p>This is a single page web app based on the SAFE Web App Tutorial, but modified to use the Svelte framework. It uses a modified version of the 7guis CRUD example from the Svelte website.
  <p>&nbsp;</p>
  <h2>What it does</h2>
  <p>TODO: The list shows ???</p>
</div>

<div class='content'>
  <input placeholder="filter prefix" bind:value={prefix}>

  <select bind:value={i} size={5}>
  	<option value="">Select a person to edit</option>
  	{#each filteredPeople as person, i}
  		<option value={i}>{person.last}, {person.first}</option>
  	{/each}
  </select>

  <label><input bind:value={first} placeholder="first"></label>
  <label><input bind:value={last} placeholder="last"></label>

  <div class='buttons'>
  	<button on:click={create} disabled="{!first || !last}">create</button>
  	<button on:click={update} disabled="{!first || !last || !selected}">update</button>
  	<button on:click={remove} disabled="{!selected}">delete</button>
  </div>
</div>
<hr>

<div class='content'>
  <h2>About Svelte</h2>
  <p>Svelte is a new easy to learn web framework which can be used to create web apps on SAFE Network. Svelte is:</p>
  <li>compiled</li>
  <li>fast and lightweight (suitable for mobile and embedded apps)</li>
  <li>creates truly reactive code</li>
  <li>is more declarative (e.g. 40% less code to write)</li>
  <li>when using the sapper router, can still be exported to create a static website (see Sapper documentation on 'Exporting')</li>
</div>
