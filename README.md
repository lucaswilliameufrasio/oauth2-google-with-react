# Oauth2 Google with React

## How to run

### API

1. Get your Google API client ID (copied from [@react-oauth/google](https://www.npmjs.com/package/@react-oauth/google))

`Key Point: Add both http://localhost and http://localhost:<port_number> to the Authorized JavaScript origins box for local tests or development.`

2. Navigate to the api folder

``` bash
cd api
```

3. Install dependencies
``` bash
npm ci
```

4. Copy .env.example file and fill with your Google Oauth API Client and Secret

``` bash
cp .env.example .env
```

5. Start the app
``` bash
npm run dev
```

### Web

1. Navigate to the web folder

``` bash
cd web
```

3. Install dependencies
``` bash
npm ci
```

4. Copy .env.example file and fill with your Google Oauth API Client Id and API URL

``` bash
cp .env.example .env
```

5. Start the app
``` bash
npm run dev
```