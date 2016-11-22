# dev-env-status-check

Check the availability of common Node development environment dependencies like `node`, `npm`, `git`, and others.

[![npm][npm-image]][npm-url]
[![travis][travis-image]][travis-url]
[![standard][standard-image]][standard-url]
[![conduct][conduct]][conduct-url]

[npm-image]: https://img.shields.io/npm/v/dev-env-status-check.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/dev-env-status-check
[travis-image]: https://img.shields.io/travis/sethvincent/dev-env-status-check.svg?style=flat-square
[travis-url]: https://travis-ci.org/sethvincent/dev-env-status-check
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[standard-url]: http://npm.im/standard
[conduct]: https://img.shields.io/badge/code%20of%20conduct-contributor%20covenant-green.svg?style=flat-square
[conduct-url]: CONDUCT.md

## About

When helping a new programmer set up their computer for the first time it can be difficult to debug their system.

This module intends to be a high-level approach to checking which dependencies are correctly set up on a computer.

It's written with node, which may seem a little silly (what if they don't have node yet?!), but the intent is to use this inside Electron apps.

The first electron app to use this module is [dev-env-status](https://github.com/dev-env-status), a simple app that shows the availability of each tool and how to install it if needed.

## Work in progress

There are still some improvements that need to be made before ready for use. [Contributions are welcome.](CONTRIBUTING.md)

### Planned improvements (PRs welcome!)

This module needs to be tested and adapted for use on both linux and windows.

There are ways this module can be smarter about detecting system dependencies. For example: what if a macOS user doesn't have `gcc` yet?

The current implementation is a bunch of functions, and the status for each tool being checked is returned in one big object. Instead it could be cool if the interface was a stream, and each data event is the status object of the tool being checked. Then the app using this module can update the UI on completion of each tool check.

Check out the [dev-env-status](https://github.com/dev-env-status) repo for additional improvements.

### Command-line tools that are checked:

- `node`
- `npm`
- `git`

If on macOS:

- `brew` – optional, if you want to check for homebrew

Optional:

- `atom` – if you want to see if atom command-line tool is available

### Each tool returns an object with:

- `exists` – boolean
- `path` – absolute path for the command
- `version` – version of the command

### Operating system information

You're also provided information about the computer's operating system:

- `arch` – return value of `os.arch()`
- `platform` – return value of `os.platform()`
- `release` – return value of `os.release()`
- `name` – `macOS Sierra` for example

## Install

```sh
npm install --save dev-env-status-check
```

## Usage

```js
var check = require('dev-env-status-check')

check({ skipAtom: true }, function (status) {
  console.log(status)
})
```

### Example value of `status`

```js
{
  os:{
    arch: 'x64',
    platform: 'darwin',
    release: '16.1.0',
    name: 'macOS Sierra'
  },
  node:{
    exists: true,
    path: '/Users/sdv/.nvm/versions/node/v6.9.1/bin/node',
    version: 'v6.9.1'
  },
  npm:{
    exists: true,
    path: '/Users/sdv/.nvm/versions/node/v6.9.1/bin/npm',
    version: '3.10.8'
  },
  git:{
    exists: true,
    path: '/usr/local/bin/git',
    version: '2.9.0'
  },
  atom:{
    exists: true,
    path: '/usr/local/bin/atom',
    version: '1.12.4'
  },
  homebrew:{
    exists: true,
    path: '/usr/local/bin/brew',
    version: '1.0.6-63-g0546d90'}
  }
```

## Documentation
- [Getting started](docs/getting-started.md)
- [Related modules](docs/related-modules.md)
- [API](docs/api.md)
- [Tests](tests/)

### Examples
- [Basic example](examples/basic.js)

## Contributing

Contributions are welcome! Please read the [contributing guidelines](CONTRIBUTING.md) first.

## Conduct

It is important that this project contributes to a friendly, safe, and welcoming environment for all. Read this project's [code of conduct](CONDUCT.md)

## Changelog

Read about the changes to this project in [CHANGELOG.md](CHANGELOG.md). The format is based on [Keep a Changelog](http://keepachangelog.com/) and this project adheres to [Semantic Versioning](http://semver.org/).

## Contact

- **issues** – Please open issues in the [issues queue](https://github.com/sethvincent/dev-env-status-check/issues)
- **twitter** – Have a question? [@sethdvincent](https://twitter.com/sethdvincent)
- **email** – Need in-depth support via paid contract? Send an email to sethvincent@gmail.com

## License

[ISC](LICENSE.md)
