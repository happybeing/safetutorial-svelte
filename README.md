*Psst — looking for a shareable component template? Go here --> [sveltejs/component-template](https://github.com/sveltejs/component-template)*

---

# SAFE Network Tutorial app using Svelte

This is a version of the SAFE NodeJS Tutorial app using the [Svelte](https://svelte.dev) web app framework. It is based on the Svelte 'hello world' template at https://github.com/sveltejs/template.

## Prerequisites

- you will need to have [Node.js](https://nodejs.org) v8.15+ for this to work with SAFE Browser.
- before trying this you should first go through the [SAFE Node.js Web Tutorial](https://hub.safedev.org/platform/web) to ensure you have all pre-requisites

## Get started

To create a new project based on this template using [degit](https://github.com/Rich-Harris/degit):

```bash
npx degit theWebalyst/safetutorial-svelte safe-svelte-app
cd safe-svelte-app
npm install
```


```bash
cd safe-svelte-app
npm install
```

...then start [Rollup](https://rollupjs.org):

```bash
npm run dev
```

Start SAFE Browser (dev build) and navigate to [localhost:5000](http://localhost:5000). You should see your app running. Edit a component file in `src`, save it and the page will reload to show your changes.


## Deploying to SAFE Network

1. Create a production build (in `./public`):

```bash
   npm run build
```

2. Use the Maidsafe Web Hosting Manager or similar application to create a public name and service, and then upload the contents of `./public` to your web service folder.

3. Open your website/app in SAFE Browser

## Deploying to the web

### With [now](https://zeit.co/now)

Install `now` if you haven't already:

```bash
npm install -g now
```

Then, from within your project folder:

```bash
now
```

As an alternative, use the [Now desktop client](https://zeit.co/download) and simply drag the unzipped project folder to the taskbar icon.

### With [surge](https://surge.sh/)

Install `surge` if you haven't already:

```bash
npm install -g surge
```

Then, from within your project folder:

```bash
npm run build
surge public
```
