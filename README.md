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

## Running tests

```bash
npm run test
```

## How to run locally

Additional environments vars

| Environment Var                | Description                                                                      | Example                              |
| ------------------------------ | -------------------------------------------------------------------------------- | ------------------------------------ |
| API_URL                        | DC API URL                                                                       | https://api.amplience.net/v2/content |
| AUTH_URL                       | Amplience Auth URL                                                               | https://auth.adis.ws                 |
| HUB_ID                         | Hub ID                                                                           | abcdef...                            |
| CLIENT_ID                      | Client ID for the Hub                                                            | abcdef...                            |
| CLIENT_SECRET                  | Client Secret                                                                    | abdde...                             |
| LOCATION_HREF                  | Location href of parent                                                          | http://localhost:3000                |
| BREAKDOWN_CHART_TITLE          | Breakdown chart title                                                            | Breakdown chart                      |
| BREAKDOWN_CHART_DIMENSION      | Dimension for the chart                                                          | ga:deviceCategory                    |
| GOOGLE_ANALYTICS_CLIENT_ID     | Google Analytics Client ID                                                       | abc123.apps.googleusercontent.com    |
| GOOGLE_ANALYTICS_VIEW_ID       | Google Analytics View ID                                                         | ga:1234567890                        |
| GOOGLE_ANALYTICS_LOCALE        | Google Analytics View ID                                                         | en-GB                                |
| GOOGLE_ANALYTICS_CURRENCY_CODE | Google Analytics View ID                                                         | GBP                                  |
| GOOGLE_ANALYTICS_TIMEOUT       | Timeout used to determine how long we should wait before retrying a gapi request | 30000                                |

Example `.env` file

```
CLIENT_ID=abcdef
CLIENT_SECRET=abcdef
HUB_ID=abcdef
API_URL=https://api.amplience.net/v2/content
AUTH_URL=https://auth.adis.ws
LOCATION_HREF=http://localhost:3000
BREAKDOWN_CHART_TITLE=Device Breakdown
BREAKDOWN_CHART_DIMENSION=ga:deviceCategory
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

The dashboard requires certain configuration to work with Google analytics and the following example settings need to be defined:

### Permissions

To use the application the following permissions must be enabled:

- Allow same origin
- Allow pop-ups

### Installation parameters

```json
{
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
  "breakdownChart": {
    "title": "Breakdown chart title",
    "dimension": "ga:deviceCategory"
  }
}
```

The dimensions provided should map to the fields in which have been set up in the Google analytics dashboard for the fields outlined above.
