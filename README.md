# common-util
> A collection of common libraries and utilities used throughout Node.js projects in Showtime

<!-- TOC titleSize:2 tabSpaces:2 depthFrom:1 depthTo:6 withLinks:1 updateOnSave:1 orderedList:0 skip:0 title:1 charForUnorderedList:* -->
## Table of Contents
* [common-util](#common-util)
    * [Install](#install)
    * [Libraries](#libraries)
    * [For Developers](#for-developers)
<!-- /TOC -->

### Install
```shell
npm config set @shoany:registry https://repo.showtimeanytime.com/artifactory/api/npm/npm-local/
npm install @shoany/common-util
```

### Libraries
- axios-client
- lambda-client
- redis-client
- s3-client
- sqs-client
- lambda-wrapper
- utils

### For Developers
1. Write the code to support your feature/fix/enhancement, etc.
2. Add any unti tests, if applicable
3. Run `npm test`
4. If all test pass, commit to source control, ensuring the commit message conforms to to the Angular convention (see number 2 of [this](https://git.showtimeanytime.com/projects/MDICK/repos/node-js-ci-cd/browse#pre-requisites) guide section).
5. Run a semantic release, `npx release`. You can do a dry run first by doing `npx release-dry-run`.
