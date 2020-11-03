import { App, Stack, StackProps } from '@aws-cdk/core';
import {
  AmplienceAmplify,
  AmplienceAmplifyProps,
} from '@amplience/amp-cdk-amplify';

export class AmplifyStack extends Stack {
  constructor(
    scope: App,
    id: string,
    props: StackProps & AmplienceAmplifyProps
  ) {
    super(scope, id, props);
    new AmplienceAmplify(this, `${id}-amp-amplify`, props);
  }
}
