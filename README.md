# dc-extension-ga-dashboard

## Get started

Install the dependencies...

```bash
npm ci
```

## How to build

To create an optimised version of the app:

```bash
npm run build
```
### Build Configuration

| Environment Var                        | Description                                                   | Default   |
| -------------------------------------- | ------------------------------------------------------------- | --------- |
| MAX_NUM_EDITIONS                       | Maximum number of editions to display                         | 20        |
| MAX_NUMBER_OF_SELECTABLE_CONTENT_ITEMS | Maximum number of selectable content items                    | 5         |
| MAX_NUMBER_OF_SELECTABLE_SLOTS         | Maximum number of selectable slots                            | 5         |
| GOOGLE_ANALYTICS_TIMEOUT               | How long we should wait before retrying a gapi request        | 30000     |
| GOOGLE_ANALYTICS_TOKEN_EXPIRES_IN      | Used to manually set gapi token expires in value (in seconds) | undefined |

## Running tests

```bash
npm run test
```

## How to run locally

...then start [Rollup](https://rollupjs.org):

```bash
npm run dev
```

Navigate to [localhost:3000](http://localhost:3000). You should see your app running. Edit a component file in `src`, save it, and reload the page to see your changes.

## Dashboard extension configuration

An extension needs to be registered in the Dynamic Content Application under the type of dashboard.

The dashboard requires certain configuration to work with Google analytics and the following example settings need to be defined:

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

1. Create a Google APIs [Service account](https://console.cloud.google.com/iam-admin/serviceaccounts)
1. In the Service account edit screen in the 'Keys' section add a key
1. Securely store the generate json file
1. From the json file copy the "private_key" and add it to the installation params as "googleAnalyticsKey"
1. Do the same for "client_email" adding it as "googleAnalyticsClientEmail"
1. Give the email "Read & Analyse" permission to your Analytics site

#### Dimensions

The dimensions provided should map to the fields in which have been set up in the Google analytics dashboard for the fields outlined above.

#### Filters

For each report, Top Content, Top Editions, Top Slots, it is possible to specify optional fields that are used to additionally filter the reports, for example to set up a fiter to show only data for an event category called 'Banners', set a filter of 'ga:eventCategory==Banners'
