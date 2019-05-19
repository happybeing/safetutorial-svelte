let safeApp;

async function authoriseAndConnect() {
  let appInfo = {
      name: 'Hello SAFE Network',
      id: 'net.maidsafe.tutorials.web-app',
      version: '1.0.0',
      vendor: 'MaidSafe.net Ltd.'
  };
  safeApp = await window.safe.initialiseApp(appInfo);
  console.log('Authorising SAFE application...');
  const authReqUri = await safeApp.auth.genAuthUri();
  const authUri = await window.safe.authorise(authReqUri);
  console.log('SAFE application authorised by user');
  await safeApp.auth.loginFromUri(authUri);
  console.log("Application connected to the network");
};

let md;

async function getMd() {
  if (md === undefined) await initSafe()
  return md
}

async function createMutableData() {
  console.log("Creating MutableData with initial dataset...");
  const typeTag = 15000;
  md = await safeApp.mutableData.newRandomPublic(typeTag);
  const initialData = {
    "random_key_1": JSON.stringify({
        text: 'Scotland to try Scotch whisky',
        made: false
    }),
    "random_key_2": JSON.stringify({
        text: 'Patagonia before I\'m too old',
        made: false
    })
  };
  await md.quickSetup(initialData);
};

export function getPeople() {
  console.log('safe-api: getPeople()')
  return [
		{
			first: 'David',
			last: 'Irvine'
		},
		{
			first: 'Nick',
			last: 'Lambert'
		},
		{
			first: 'Dug',
			last: 'Campbell'
		}
	];
};

export async function getItems() {
  const entries = await (await getMd()).getEntries();
  const entriesList = await entries.listEntries();
  const items = [];
  entriesList.forEach((entry) => {
    const value = entry.value;
    if (value.buf.length == 0) return;
    const parsedValue = JSON.parse(value.buf);
    items.push({ key: entry.key, value: parsedValue, version: value.version });
  });
  console.log('getItems() returning\n%O', items)
  return items;
};

async function insertItem(key, value) {
  const mutations = await safeApp.mutableData.newMutation();
  await mutations.insert(key, JSON.stringify(value));
  await (await getMd()).applyEntriesMutation(mutations);
};

async function updateItem(key, value, version) {
  const mutations = await safeApp.mutableData.newMutation();
  await mutations.update(key, JSON.stringify(value), version + 1);
  await (await getMd()).applyEntriesMutation(mutations);
};

async function deleteItems(items) {
  const mutations = await safeApp.mutableData.newMutation();
  items.forEach(async (item) => {
    await mutations.delete(item.key, item.version + 1);
  });
  await (await getMd()).applyEntriesMutation(mutations);
};

let isInitialised = false;

export async function initSafe() {
  console.log('safe-api: initSafe()!!!')

  await authoriseAndConnect();
  await createMutableData();
  isInitialised = true;
}

export function isSafeInitialised() { return isInitialised; }
