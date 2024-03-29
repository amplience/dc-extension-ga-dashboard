# Contributing

## Developing dc-extension-ga-dashboard

You are considering contributing changes to dc-extension-ga-dashboard – thank you!
Please read these guidelines when filling a pull request:

- Commits follow the [Angular commit convention](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines)
- 2 spaces indentation
- Features and bug fixes should be covered by test cases

## Commit Messages

To keep our commit messsages consistent, please run `npm run commit` instead of `git commit`.
You'll be prompted to fill in any required fields and your commit messages will be formatted according to our standards

## Creating releases

dc-extension-ga-dashboard uses [semantic-release](https://github.com/semantic-release/semantic-release)
to release new versions automatically.

- Commits of type `fix` will trigger bugfix releases, think `0.0.1`
- Commits of type `feat` will trigger feature releases, think `0.1.0`
- Commits with `BREAKING CHANGE` in body or footer will trigger breaking releases, think `1.0.0`

All other commit types will trigger no new release.
