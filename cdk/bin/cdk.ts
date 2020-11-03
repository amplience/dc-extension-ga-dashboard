#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { AmplifyStack } from '../lib/amplify-stack';
import { SupportedSourceCodeProviders } from '@amplience/amp-cdk-amplify';

const app = new cdk.App();

export const devStack = new AmplifyStack(app, 'dev-dc-extension-ga-dashboard', {
  owner: 'amplience',
  repository: 'dc-extension-ga-dashboard',
  oauthTokenSecretId: 'qa-tupperware-github-pat',
  branch: 'master',
  sourceCodeProvider: SupportedSourceCodeProviders.GITHUB,
  domain: 'dev-dc-extension-ga-dashboard.dev.adis.ws',
  buildPullRequestsPreview: true,
  environmentVariables: {},
  tagging: {
    application: 'dc-extension-ga-dashboard',
    applicationFunction: 'frontend',
    confidentiality: 'public',
    env: 'dev',
    owner: 'tupperware',
    product: 'dc',
    zone: 'public',
  },
});

export const qaStack = new AmplifyStack(app, 'qa-dc-extension-ga-dashboard', {
  owner: 'amplience',
  repository: 'dc-extension-ga-dashboard',
  oauthTokenSecretId: 'qa-tupperware-github-pat',
  branch: 'master',
  sourceCodeProvider: SupportedSourceCodeProviders.GITHUB,
  domain: 'qa-dc-extension-ga-dashboard.dev.adis.ws',
  buildPullRequestsPreview: true,
  environmentVariables: {},
  tagging: {
    application: 'dc-extension-ga-dashboard',
    applicationFunction: 'frontend',
    confidentiality: 'public',
    env: 'qa',
    owner: 'tupperware',
    product: 'dc',
    zone: 'public',
  },
});

export const prodStack = new AmplifyStack(
  app,
  'prod-dc-extension-ga-dashboard',
  {
    owner: 'amplience',
    repository: 'dc-extension-ga-dashboard',
    oauthTokenSecretId: 'qa-tupperware-github-pat',
    branch: 'production',
    sourceCodeProvider: SupportedSourceCodeProviders.GITHUB,
    domain: 'dc-extension-ga-dashboard.amplience.net',
    buildPullRequestsPreview: true,
    environmentVariables: {},
    tagging: {
      application: 'dc-extension-ga-dashboard',
      applicationFunction: 'frontend',
      confidentiality: 'public',
      env: 'prod',
      owner: 'tupperware',
      product: 'dc',
      zone: 'public',
    },
  }
);
