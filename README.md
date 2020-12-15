# dc-extension-ga-dashboard

## Getting started

Install the dependencies...

```bash
npm ci
```

## How to build

To build a version of the app:

```bash
npm run build
```
### Build Configuration

| Environment Var                        | Description                                | Default |
| -------------------------------------- | ------------------------------------------ | ------- |
| MAX_NUM_EDITIONS                       | Maximum number of editions to display      | 20      |
| MAX_NUMBER_OF_SELECTABLE_CONTENT_ITEMS | Maximum number of selectable content items | 5       |
| MAX_NUMBER_OF_SELECTABLE_SLOTS         | Maximum number of selectable slots         | 5       |


## Running tests

```bash
npm run test
```

## How to run locally

Additional environments vars

| Environment Var                   | Description                                                   | Example                                  |
| --------------------------------- | ------------------------------------------------------------- | ---------------------------------------- |
| API_URL                           | DC API URL                                                    | https://api.amplience.net/v2/content     |
| AUTH_URL                          | Amplience Auth URL                                            | https://auth.adis.ws                     |
| HUB_ID                            | Hub ID                                                        | abcdef...                                |
| CLIENT_ID                         | Client ID for the Hub                                         | abcdef...                                |
| CLIENT_SECRET                     | Client Secret                                                 | abddef...                                 |
| LOCATION_HREF                     | Location href of parent                                       | http://localhost:3000                    |
| BREAKDOWN_CHART_TITLE             | Breakdown chart title                                         | Breakdown chart                          |
| BREAKDOWN_CHART_DIMENSION         | Dimension for the chart                                       | ga:deviceCategory                        |
| GOOGLE_ANALYTICS_KEY              | Google Analytics Service Account private key                  |                                          |
| GOOGLE_ANALYTICS_CLIENT_EMAIL     | Google Analytics Client Email                                 | abc123@abc123.apps.googleusercontent.com |
| GOOGLE_ANALYTICS_CLIENT_ID        | Google Analytics Client ID                                    | abc123.apps.googleusercontent.com        |
| GOOGLE_ANALYTICS_VIEW_ID          | Google Analytics View ID                                      | ga:1234567890                            |
| GOOGLE_ANALYTICS_LOCALE           | Google Analytics View ID                                      | en-GB                                    |
| GOOGLE_ANALYTICS_CURRENCY_CODE    | Google Analytics View ID                                      | GBP                                      |
| GOOGLE_ANALYTICS_TIMEOUT          | How long we should wait before retrying a gapi request        | 30000                                    |
| GOOGLE_ANALYTICS_TOKEN_EXPIRES_IN | Used to manually set gapi token expires in value (in seconds) | 3600                                     |


### Example `.env` file

```
CLIENT_ID=abcdef
CLIENT_SECRET=abcdef
HUB_ID=abcdef
API_URL=https://api.amplience.net/v2/content
AUTH_URL=https://auth.adis.ws
LOCATION_HREF=http://localhost:3000
BREAKDOWN_CHART_TITLE=Device Breakdown
BREAKDOWN_CHART_DIMENSION=ga:deviceCategory
GOOGLE_ANALYTICS_KEY=<service_account_private_key>
GOOGLE_ANALYTICS_CLIENT_EMAIL=abc123@abc123.apps.googleusercontent.com
GOOGLE_ANALYTICS_CLIENT_ID=abc123.apps.googleusercontent.com
GOOGLE_ANALYTICS_VIEW_ID=ga:1234567890
GOOGLE_ANALYTICS_LOCALE=en-GB
GOOGLE_ANALYTICS_CURRENCY_CODE=GBP
GOOGLE_ANALYTICS_TIMEOUT=5000
```

...then start [Rollup](https://rollupjs.org):

```bash
STANDALONE=1 npm run dev
```

Navigate to [localhost:3000](http://localhost:3000). You should see your app running. Edit a component file in `src`, save it, and reload the page to see your changes.

## Dashboard extension configuration

An extension needs to be registered in the Dynamic Content Application under the type of dashboard.

The dashboard requires a specific configuration to work with Google Analytics and the following example settings need to be defined:

### Permissions

To use the application the following permissions must be enabled:

- Allow same origin
- Allow pop-ups

### Installation parameters

```json
{
  "googleAnalyticsKey": "<service_account_private_key>",
  "googleAnalyticsClientEmail": "abc123@abc123.apps.googleusercontent.com",
  "googleAnalyticsClientId": "abc123.apps.googleusercontent.com",
  "googleAnalyticsViewId": "ga:1234567890",
  "mappings": {
    "contentItemId": "ga:dimension1",
    "editionId": "ga:dimension2",
    "slotId": "ga:dimension3"
  },
  "localization": {
    "locale": "en-GB",
    "currencyCode": "GBP"
  },
  "breakdown": {
    "title": "Breakdown chart title",
    "dimension": "ga:deviceCategory"
  },
  "filters": {
    "contentItemFilter": "ga:eventCategory==StoreContent",
    "editionFilter": "ga:eventCategory==StoreContent",
    "slotFilter": "ga:eventCategory==StoreContent"
  }
}
```

### Google Analytics Service Account Authorization

By default the dashboard will allow users to login to their Google account to view analytics data on the dashboard. To avoid this a Service Account can be created allowing the dashboard to authorize using a private key and client email.

1. Create a Google APIs [Service Account](https://console.cloud.google.com/iam-admin/serviceaccounts)
1. In the Service Account edit screen in the 'Keys' section add a key
1. Securely store the generate json file
1. From the json file copy the "private_key" and add it to the installation params as "googleAnalyticsKey"
1. Do the same for "client_email" adding it as "googleAnalyticsClientEmail"
1. Give the email "Read & Analyse" permission to your Analytics site

### Dimensions

The dimensions provided should map to the fields in which have been set up in the Google Analytics dashboard for the fields outlined above.

### Filters

For each report, Top Content, Top Editions, Top Slots, it is possible to specify optional fields that are used to additionally filter the reports, for example to set up a fiter to show only data for an event category called 'Banners', set a filter of 'ga:eventCategory==Banners'.
