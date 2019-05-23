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
  console.log("safe-api: Application connected to the network");
};

let md;

async function createMutableData() {
  console.log("safe-api: Creating MutableData with initial dataset...");
  const typeTag = 15000;
  md = await safeApp.mutableData.newRandomPublic(typeTag);
  const initialData = {
    "1": JSON.stringify({
        text: 'Scotland to try Scotch whisky',
        made: false
    }),
    "2": JSON.stringify({
        text: 'Patagonia before I\'m too old',
        made: false
    })
  };
  await md.quickSetup(initialData);
};

let lastItems = []

export async function getItems() {
  console.log('safe-api: getItems()')
  if (!await isSafeInitialised()) return [];
  const entries = await md.getEntries();
  const entriesList = await entries.listEntries();
  const items = [];
  entriesList.forEach((entry) => {
    const value = entry.value;
    if (value.buf.length == 0) return;
    const parsedValue = JSON.parse(value.buf);
    items.push({ key: entry.key, value: parsedValue, version: value.version });
  });
  lastItems = items
  console.log('getItems() returning\n%O', items)
  return items;
};

export async function insertItem(key, value) {
  console.log('safe-api: insertItem()')
  if (!await isSafeInitialised()) return;

  try {
    let valueVersion = await md.get(key)
    if (valueVersion !== undefined) return updateItem(key, value, valueVersion.version+1)
  } catch(e) {
    const mutations = await safeApp.mutableData.newMutation();
    await mutations.insert(key, JSON.stringify(value));
    await md.applyEntriesMutation(mutations);
  }
};

export async function updateItem(key, value, version) {
  console.log('safe-api: updateItem()')
  if (!await isSafeInitialised()) return;
  const mutations = await safeApp.mutableData.newMutation();
  await mutations.update(key, JSON.stringify(value), version);
  await md.applyEntriesMutation(mutations);
};

export async function deleteItems(items) {
  console.log('safe-api: deleteItems()')
  if (!await isSafeInitialised()) return;
  const mutations = await safeApp.mutableData.newMutation();
  items.forEach(async (item) => {
    await mutations.delete(item.key, item.version + 1);
  });
  await md.applyEntriesMutation(mutations);
};

let isInitialised = false;
let initActive = false;

export async function initSafe() {
  console.log('safe-api: initSafe()')
  if (isInitialised) {
    console.log('safe-api: skipping init - already initialised')
    return true;
  }

  if (initActive) {
    console.log('safe-api: skipping init - already in progress')
    return false;
  }

  initActive = true;
  await authoriseAndConnect();
  await createMutableData();
  isInitialised = true;
  initActive = false;
  return true;
}

export async function isSafeInitialised() { return initSafe(); }
