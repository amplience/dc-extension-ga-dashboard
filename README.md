# dc-extension-ga-dashboard

## Get started

Install the dependencies...

```bash
npm install
```

## Environment Vars

| Environment Var            | Description                     | Example                           |
| -------------------------- | ------------------------------- | --------------------------------- |
| GOOGLE_ANALYTICS_CLIENT_ID | Google Analytics Client ID      | abc123.apps.googleusercontent.com |
| GOOGLE_ANALYTICS_APP_ID    | Google Analytics Application ID | 1234567890                        |

## Building and running in production mode

To create an optimised version of the app:

```bash
npm run build
```

## Building and running in development mode

Additional environments vars

| Environment Var | Description           | Example                               |
| --------------- | --------------------- | ------------------------------------- |
| API_URL         | DC API URL            | https://apigee-dev.adis.ws/v2/content |
| AUTH_URL        | Amplience Auth URL    | https://auth-qa3.adis.ws              |
| HUB_ID          | Hub ID                | abcdef...                             |
| CLIENT_ID       | Client ID for the Hub | abcdef...                             |
| CLIENT_SECRET   | Client Secret         | abdde...                              |

Example `.env` file

```
CLIENT_ID=abcdef
CLIENT_SECRET=abcdef
HUB_ID=abcdef
API_URL=https://apigee-dev.adis.ws/v2/content
AUTH_URL=https://auth-qa3.adis.ws
```

...then start [Rollup](https://rollupjs.org):

```bash
STANDALONE=1 npm run dev
```

Navigate to [localhost:5000](http://localhost:5000). You should see your app running. Edit a component file in `src`, save it, and reload the page to see your changes.

## Running tests

```bash
npm run test
```

## How to release

### Prep work

1. Merge all PR's down into master
2. Run `npm ci`
3. Create a release commit `npm run release`
4. Push the new tag back to master `git push --follow-tags origin master` - If you get an error regarding "Required status check "build(12.x)" is in progress", wait 5 minutes and try again
5. Raise a Github Release - Click on Releases (right hand side), click on the tags button and click "...", enter the version and copy and copy the changelog.md changes into the release notes
6. Raise [Amplience Release Request](<https://amplience.sharepoint.com/sites/DeliveryManagement/SitePages/Release-Requests(1).aspx>)

### Releasing

#### Via PR

1. Raise a PR from `master` into `production`
2. Ensure all build checks have completed successfully
3. Merge PR via "REBASE" option

#### Manual

1. Checkout `production` branch and pull down the latest changes `git pull origin production`
2. Record the top/current git commit ID `git log` (will be used to in the event of a rollback)
3. Switch back to `master` branch
4. Point `production` branch to the new tag `git branch -f production vx.x.x`
5. Force push `production` branch `git push -f origin production`
6. Log into AWS Amplify and check deployment status

### Rolling back

#### Via PR

1. Navigate to the merged PR and select "revert"/"undo" merge.

#### Manual

1. Checkout `production` branch and pull down the latest changes `git pull origin production`
2. Point `production` branch to the old git commit ID `git branch -f production OLD_COMMIT_ID`
3. Force push `production` branch `git push -f origin production`
4. Log into AWS Amplify and check deployment status

# Dashboard extension configuration

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
  "googleAnalyticsViewId": "1234567890",
  "mappings": {
    "contentItemId": "dimension1",
    "editionId": "dimension2",
    "slotId": "dimension3"
  }
}
```

The dimensions provided should map to the fields in which have been set up in the Google analytics dashboard for the fields outlined above.
