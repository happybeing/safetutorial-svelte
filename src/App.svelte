<!-- https://eugenkiss.github.io/7guis/tasks#crud -->

<script>
  import { initSafe,
    isSafeInitialised,
    getItems,
    insertItem,
    updateItem,
    deleteItems
  } from './safe-api'

  let items = []
  getItems().then((v) => { items = v })

	let prefix = '';
  let made = '';
  let text = '';
  let madeInput = '';
  let textInput = '';
	let i = 0;

  $: showi = console.log('i: ', i);
  $: showselection = console.log('selection: ', ( filteredItems[i] ? filteredItems[i].key.toString() + ' ' + filteredItems[i].value.text : 'none'));

	$: filteredItems = prefix
		? items.filter(item => {
			const composite = `${item.value.made}, ${item.value.text}`;
			return composite.toLowerCase().startsWith(prefix.toLowerCase());
		})
		: items;

	$: selection = filteredItems[i];

	$: {
		made = selection ? selection.value.made : '';
		text = selection ? selection.value.text : '';
	}

  // $: updateEnable = updateEnabled(text, made, textInput, madeInput);
  //
  // function updateEnabled() {
  //   console.log('text, made          :', text, made)
  //   console.log('textInput, madeInput:', textInput, madeInput)
  //   let status = ((madeInput !== '' && textInput !== '') && ((made !== madeInput) || (text !== textInput)));
  //   console.log('updateEnabled() - ', status)
  //   return status;
  // }

  function onEnterForCreate(v) {
    console.log('onEnterForCreate', v)
    madeInput = textInput = '';
  }

  function onOptionClick(v) {
    console.log('onOptionClick', v)
    made = madeInput = selection ? selection.value.made.toString() : '';
		text = textInput = selection ? selection.value.text : '';
  }

  async function updateItems(keepIndex) {
    items = await getItems();
    i = Math.min(keepIndex ? keepIndex : i, items.length - 1);
    return items;
  }

  function nextKey() {
    let key = 1;
    items.forEach((item) => {
      let itemKey = Number(item.key);
      console.log('key: ', key);
      console.log('item.key: ', itemKey);
      if (itemKey > key) return;
      ++key;
    });
    return key;
  }

	async function create() {
    console.log('create()');
    let key = nextKey().toString();
    console.log('nextKey() returned:', key);
    await insertItem(key, { 'made': madeInput, 'text': textInput });
    await updateItems(Number(key)-1);
  }

	async function update() {
    console.log('update()');
    made = madeInput;
    text = textInput;
    await insertItem(items[i].key, { made, text }); // Also handles update
    await updateItems(i);
	}

	async function remove() {
    console.log('remove()');
    await deleteItems([items[i]]);
    await updateItems(i);
    if (items.length !== 0) {
      madeInput = items[i].value.made;
  		textInput = items[i].value.text;
    } else {
      madeInput = textInput = '';
    }
	}
</script>

<svelte:head>
  <title>Svelte on SAFE</title>
</svelte:head>

<div class='content'>
  <h1>SAFE Web App Tutorial example using Svelte</h1>
  <p>This is a single page web app based on the SAFE Web App Tutorial with a GUI implemented using the Svelte web framework. The source code is at https://github.com/theWebalyst/safetutorial-svelte</p>
  <p>The GUI is adapted from the 7guis CRUD example from the Svelte website. This isn't an ideal UI for the tutorial example, but was a quick way to create this demo with minimal changes to the SAFE API code from the tutorial and the 7guis CRUD example.
  <h2>What it does</h2>
  <p>The SAFE tutorial app lets you create and edit a list of places to visit, which you can mark as visited. Each entry is stored as a JSON string in a mutable data entry. Each entry value has properties for visit 'made' and a 'text' description, which are shown in the list and can be edited.</p>
</div>

<div class='content'>
  <input placeholder="filter prefix" bind:value={prefix}>

  <select bind:value={i} size={5}>
  	<option on:click={onEnterForCreate} value="">Enter data for create...</option>
  	{#each filteredItems as item, i}
  		<option on:click={onOptionClick} value={i}>{item.value.made}, {item.value.text}</option>
  	{/each}
  </select>

  <label><input bind:value={madeInput} placeholder="made"></label>
  <label><input bind:value={textInput} placeholder="text"></label>

  <div class='buttons'>
  	<button on:click={create} disabled="{(!madeInput || !textInput) || selection}">create</button>
    <!-- <button on:click={update} disabled="{!updateEnable}">update</button> -->
    <button on:click={update} disabled="{!((madeInput !== '' && textInput !== '') && ((made !== madeInput) || (text !== textInput)) && selection)}">update</button>
  	<button on:click={remove} disabled="{!selection}">delete</button>
  </div>
</div>
<hr>

<div class='content'>
  <h2>About SAFE</h2>
  <p>SAFE Network is a truly decentralised secure storage and communications network. For more see safenetwork.tech</p>
  <h2>About Svelte</h2>
  <p>Svelte is a succinct, performant web framework which can be used to create web apps on SAFE Network. For more see svelte.dev</p>
  <p>Svelte is:</p>
  <li>compiled</li>
  <li>fast and lightweight (suitable for mobile and embedded apps)</li>
  <li>creates truly reactive code</li>
  <li>is more declarative (e.g. 40% less code to write)</li>
  <li>when using the sapper router, can still be exported to create a static website (see Sapper documentation on 'Exporting')</li>
</div>

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
