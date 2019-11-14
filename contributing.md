# Contributing to `customize-cra`

This file contains information related to the contribution process for `customize-cra`. The hope is that this file will become an excellent reference guide for newcomers to the project.

It's not to that point yet though!

If you're finding yourself lost or want to suggest opportunities for better documentation, please don't hesitate to [open an issue](https://github.com/arackaf/customize-cra/issues/new)!

## 💎 Give yourself credit!

This project uses [`all-contributors`](https://allcontributors.org) to recognize contributions. If you contribute to the project, be sure to give yourself credit by [using the `all-contributors add` script](https://allcontributors.org/docs/en/cli/usage#all-contributors-add).

## Project Map

```
customize-cra/
├── babel.config.js
│  └── contains the configuration for babel presets and plugins
├── dist/
│  └── contains the code output by rollup in the build process
├── rollup.config.js
│  └── contains the configuration for the build process
└── src/
   ├── customizers/
   │  └── the functions that transform the various config files
   ├── overrides.js
   │  └── the compose functions which drive customize-cra's functionality
   └──utilities.js
       └── utility functions that the customizers rely on (like 'getBabelConfig')
```

## Committing code

This project enforces conventional commit messages via [`commitlint`](https://github.com/conventional-changelog/commitlint). See [this summary](https://www.conventionalcommits.org/en/v1.0.0-beta.4/#summary) for more information on how to write a commit message that follows the rules.

## Opening a Pull Request

Please open all Pull Requests against the `master` branch. If your Pull Request has breaking changes, open against the `next` branch instead.

## Reporting an issue

If you would like to report an issue with the project, please [open an issue](https://github.com/arackaf/customize-cra/issues/new)! We ask that you provide as much information as possible when reporting an issue to help tighten the feedback loop.
