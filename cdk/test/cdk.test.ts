import { SynthUtils } from '@aws-cdk/assert';
import { qaStack, devStack, prodStack } from '../bin/cdk';

describe('snapshot tests', () => {
  describe('qaStack', () => {
    it('should match dev snapshot', () => {
      expect(SynthUtils.toCloudFormation(devStack)).toMatchSnapshot();
    });

    it('should match qa snapshot', () => {
      expect(SynthUtils.toCloudFormation(qaStack)).toMatchSnapshot();
    });

    it('should match prod snapshot', () => {
      expect(SynthUtils.toCloudFormation(prodStack)).toMatchSnapshot();
    });
  });
});
