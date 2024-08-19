# Changelog

## [2.1.1](https://github.com/joquijada/aws-sdk-wrappers/compare/v2.1.0...v2.1.1) (2024-08-19)


### Bug Fixes

* **release:** add missing SR branch name ([02b072d](https://github.com/joquijada/aws-sdk-wrappers/commit/02b072d59f03b809764207b72a04e2e51cd1d65a))

# [2.1.0](https://github.com/joquijada/aws-sdk-wrappers/compare/v2.0.3...v2.1.0) (2024-08-19)


### Features

* **cloudformation:** add explicity CF exported type ([0e0256a](https://github.com/joquijada/aws-sdk-wrappers/commit/0e0256a3fafcfb943ecf18bb7a7f9438c8ed314b))

## [2.0.3](https://github.com/joquijada/aws-sdk-wrappers/compare/v2.0.2...v2.0.3) (2023-07-12)


### Bug Fixes

* **s3:** fix broken listAsStream ([f256871](https://github.com/joquijada/aws-sdk-wrappers/commit/f2568716f9cb0154fa1fdae1481ff59f48c4b680))

## [2.0.2](https://github.com/joquijada/aws-sdk-wrappers/compare/v2.0.1...v2.0.2) (2023-07-12)


### Bug Fixes

* **s3:** make sure continuation token value is a string, not a boolean ([f8c43be](https://github.com/joquijada/aws-sdk-wrappers/commit/f8c43be6328918d750e5b772267d31d4ff01a8e9))

## [2.0.1](https://github.com/joquijada/aws-sdk-wrappers/compare/v2.0.0...v2.0.1) (2023-07-12)


### Bug Fixes

* **s3:** get rid of infinitely circling over S3 objects when sync'ing/listing ([37cfe20](https://github.com/joquijada/aws-sdk-wrappers/commit/37cfe20fe0e59b11dd062b00f884f067618f6af9))

# [2.0.0](https://github.com/joquijada/aws-sdk-wrappers/compare/v1.15.2...v2.0.0) (2023-07-12)


### Features

* **s3:** implement startAfter to support resume S3 bucket sync scenarios ([bfe55b1](https://github.com/joquijada/aws-sdk-wrappers/commit/bfe55b166cc809c976ff007237b8aa6189df7cb4))


### BREAKING CHANGES

* **s3:** the interface of listAsStream changed from param list of destructured object

## [1.15.2](https://github.com/joquijada/aws-sdk-wrappers/compare/v1.15.1...v1.15.2) (2023-07-09)


### Bug Fixes

* **s3:** fix liveliness failure during sync ([5cc902e](https://github.com/joquijada/aws-sdk-wrappers/commit/5cc902e5dd05dc51a5847779040cae22de694a7d))

## [1.15.1](https://github.com/joquijada/aws-sdk-wrappers/compare/v1.15.0...v1.15.1) (2023-07-08)


### Bug Fixes

* **s3:** add missing argument to S3 put call during sync ([d2729ff](https://github.com/joquijada/aws-sdk-wrappers/commit/d2729ff34b561e05a2d6c5597eb4a550ced90343))

# [1.15.0](https://github.com/joquijada/aws-sdk-wrappers/compare/v1.14.4...v1.15.0) (2023-07-08)


### Features

* **s3:** add cross account S3 sync capabilities ([839ddfe](https://github.com/joquijada/aws-sdk-wrappers/commit/839ddfef08ffc9c9e2d8091e7558321f3e3a4f5e))

## [1.14.4](https://github.com/joquijada/aws-sdk-wrappers/compare/v1.14.3...v1.14.4) (2023-05-06)


### Bug Fixes

* **redis:** add missing commands like `hscanStream` ([96feae6](https://github.com/joquijada/aws-sdk-wrappers/commit/96feae6b7fa4c0c047768558001b8e867d06240d))

## [1.14.3](https://github.com/joquijada/aws-sdk-wrappers/compare/v1.14.2...v1.14.3) (2023-05-05)


### Bug Fixes

* **redis:** add other missing Redis types ([a6df59d](https://github.com/joquijada/aws-sdk-wrappers/commit/a6df59d7d2a6a31a48e6c24169323d1983bfbc1d))

## [1.14.2](https://github.com/joquijada/aws-sdk-wrappers/compare/v1.14.1...v1.14.2) (2022-12-03)


### Bug Fixes

* **cognito:** keep naming consistent with others ([d319b6c](https://github.com/joquijada/aws-sdk-wrappers/commit/d319b6c886099c746599ed5c4ba8b5277e3cc6a9))

## [1.14.1](https://github.com/joquijada/aws-sdk-wrappers/compare/v1.14.0...v1.14.1) (2022-11-20)


### Bug Fixes

* **lambda-client:** fix method return type ([a1e74f5](https://github.com/joquijada/aws-sdk-wrappers/commit/a1e74f5dbdd4a2800517aafc09cda258b6a32283))

# [1.14.0](https://github.com/joquijada/aws-sdk-wrappers/compare/v1.13.0...v1.14.0) (2022-11-20)


### Features

* **clients:** type all the client offerings ([b3f6e7d](https://github.com/joquijada/aws-sdk-wrappers/commit/b3f6e7d3469b01eb2922962692e9f80afea73841))

# [1.13.0](https://github.com/joquijada/aws-sdk-wrappers/compare/v1.12.0...v1.13.0) (2022-11-04)


### Features

* **cloud-formation:** add cloud formation ([e074792](https://github.com/joquijada/aws-sdk-wrappers/commit/e074792c973a2c8e42cacdb7e4204449378cb6f0))
* **cloud-front:** add cloud front ([2ef5c49](https://github.com/joquijada/aws-sdk-wrappers/commit/2ef5c49333bfe9c6e8fd18b7870c74d9c345e66e))

# [1.12.0](https://github.com/joquijada/aws-sdk-wrappers/compare/v1.11.0...v1.12.0) (2022-10-18)


### Features

* **cw:** add cloutwatch wrapper ([0c38369](https://github.com/joquijada/aws-sdk-wrappers/commit/0c383693b828fecc072b1146ce2cb9aa3b32e368))

# [1.11.0](https://github.com/joquijada/aws-sdk-wrappers/compare/v1.10.4...v1.11.0) (2022-10-11)


### Features

* **cognito:** add cognito service provider wrapper ([c503bf9](https://github.com/joquijada/aws-sdk-wrappers/commit/c503bf9bcbe397eda0d7723b03f9b53d08cb27a9))

## [1.10.4](https://github.com/joquijada/aws-sdk-wrappers/compare/v1.10.3...v1.10.4) (2022-05-27)


### Bug Fixes

* **s3:** reduce debug statement noise ([0968468](https://github.com/joquijada/aws-sdk-wrappers/commit/096846883d10d36c89ab03da69bcd801b4cfbaa8))

## [1.10.3](https://github.com/joquijada/aws-sdk-wrappers/compare/v1.10.2...v1.10.3) (2022-04-08)


### Bug Fixes

* **axios:** pass through all arguments using rest params/spread syntax ([91c03ff](https://github.com/joquijada/aws-sdk-wrappers/commit/91c03ffcffb4b8d2c0c2ccb43fb8e24187f534ef))

## [1.10.2](https://github.com/joquijada/aws-sdk-wrappers/compare/v1.10.1...v1.10.2) (2022-04-08)


### Bug Fixes

* **axios:** pass through all arguments using rest params/spread syntax ([ce40c30](https://github.com/joquijada/aws-sdk-wrappers/commit/ce40c30a332f51a7ea94fa36ded28a3831c133a7))

## [1.10.1](https://github.com/joquijada/aws-sdk-wrappers/compare/v1.10.0...v1.10.1) (2022-04-08)


### Bug Fixes

* **axios:** await post response ([27d3bd4](https://github.com/joquijada/aws-sdk-wrappers/commit/27d3bd411e6fdd44448a3c9d5a9cc3cd153cb253))

# [1.10.0](https://github.com/joquijada/aws-sdk-wrappers/compare/v1.9.2...v1.10.0) (2022-04-08)


### Features

* **axios:** export axios post method ([291915c](https://github.com/joquijada/aws-sdk-wrappers/commit/291915c9debb9991e870e23d686919ce42cd9e37))

## [1.9.2](https://github.com/joquijada/aws-sdk-wrappers/compare/v1.9.1...v1.9.2) (2022-03-10)


### Bug Fixes

* **content:** handle json request payloads ([5df62e2](https://github.com/joquijada/aws-sdk-wrappers/commit/5df62e29360c6b224f1a6e21e448ab18e207e335))

## [1.9.1](https://github.com/joquijada/aws-sdk-wrappers/compare/v1.9.0...v1.9.1) (2022-01-31)


### Bug Fixes

* **zip:** handle zipping when files are in root bucket folder ([99e4ad1](https://github.com/joquijada/aws-sdk-wrappers/commit/99e4ad184bedf96803ced05972822b65e567d23f))

# [1.9.0](https://github.com/joquijada/aws-sdk-wrappers/compare/v1.8.3...v1.9.0) (2022-01-20)


### Features

* **s3:** add method to build brand new client ([d940fa0](https://github.com/joquijada/aws-sdk-wrappers/commit/d940fa0008d3af83f9ed7ff3c049a15c0659d730))

## [1.8.3](https://github.com/joquijada/aws-sdk-wrappers/compare/v1.8.2...v1.8.3) (2022-01-16)


### Bug Fixes

* **list:** add more debug info ([ea66e96](https://github.com/joquijada/aws-sdk-wrappers/commit/ea66e9644bdc167e7db7339a541b2ee9c9fec992))

## [1.8.2](https://github.com/joquijada/aws-sdk-wrappers/compare/v1.8.1...v1.8.2) (2022-01-16)


### Bug Fixes

* **zip:** fix paths so thatthey're relative to parent folder ([96aabe0](https://github.com/joquijada/aws-sdk-wrappers/commit/96aabe05762297e4af6af129d22cea15515412fd))

## [1.8.1](https://github.com/joquijada/aws-sdk-wrappers/compare/v1.8.0...v1.8.1) (2022-01-15)


### Bug Fixes

* **zip:** fix parent folder path ([80f1e23](https://github.com/joquijada/aws-sdk-wrappers/commit/80f1e23066d101369dd600dccb4ac84b9b3ef178))

# [1.8.0](https://github.com/joquijada/aws-sdk-wrappers/compare/v1.7.2...v1.8.0) (2022-01-15)


### Features

* **zip:** handle bucket folders in list of assets to Zip ([9609001](https://github.com/joquijada/aws-sdk-wrappers/commit/9609001ef3f991c99c396ffe30f363e65b0b4f62))

## [1.7.2](https://github.com/joquijada/aws-sdk-wrappers/compare/v1.7.1...v1.7.2) (2022-01-06)


### Bug Fixes

* **http-response:** always serialize 'body' ([d835306](https://github.com/joquijada/aws-sdk-wrappers/commit/d8353060d35f10322e3d2054c982b2f289b12dcc))

## [1.7.1](https://github.com/joquijada/aws-sdk-wrappers/compare/v1.7.0...v1.7.1) (2022-01-06)


### Bug Fixes

* **client:** expose native client api ([4488a65](https://github.com/joquijada/aws-sdk-wrappers/commit/4488a652e179f43a458e88fef4894b48537eb49d))

# [1.7.0](https://github.com/joquijada/aws-sdk-wrappers/compare/v1.6.0...v1.7.0) (2022-01-05)


### Features

* **ses:** add ses client ([62a247e](https://github.com/joquijada/aws-sdk-wrappers/commit/62a247e4635f4f12f137af548c5d7c71e7646e70))

# [1.6.0](https://github.com/joquijada/aws-sdk-wrappers/compare/v1.5.4...v1.6.0) (2022-01-03)


### Features

* **client:** add capability to update client ([27df113](https://github.com/joquijada/aws-sdk-wrappers/commit/27df113da374e8c841945a9b6b19c76b16791ddf))

## [1.5.4](https://github.com/joquijada/aws-sdk-wrappers/compare/v1.5.3...v1.5.4) (2022-01-03)


### Bug Fixes

* **client:** simplify ([5d2ba87](https://github.com/joquijada/aws-sdk-wrappers/commit/5d2ba877d77eef05682794d35f06d8c33989b824))

## [1.5.3](https://github.com/joquijada/aws-sdk-wrappers/compare/v1.5.2...v1.5.3) (2021-12-29)


### Bug Fixes

* **s3-zip:** wait on zip upload to complete ([f1a90e8](https://github.com/joquijada/aws-sdk-wrappers/commit/f1a90e838b10572d396085f5c18a5da4c7db6fc6))

## [1.5.2](https://github.com/joquijada/aws-sdk-wrappers/compare/v1.5.1...v1.5.2) (2021-12-27)


### Bug Fixes

* **stream:** make things compatible with older versions of node ([0daf9a6](https://github.com/joquijada/aws-sdk-wrappers/commit/0daf9a6801a59309bbeaa750c5b69ab623c5cc95))

## [1.5.1](https://github.com/joquijada/aws-sdk-wrappers/compare/v1.5.0...v1.5.1) (2021-12-27)


### Bug Fixes

* **s3-zip:** catch errors during zip process and log them ([ac1bf71](https://github.com/joquijada/aws-sdk-wrappers/commit/ac1bf719f69d6ece653f7d4da238a92e38dc5cf5))

# [1.5.0](https://github.com/joquijada/aws-sdk-wrappers/compare/v1.4.0...v1.5.0) (2021-12-15)


### Features

* **s3:** add new zip s3 objects method to api ([42632a7](https://github.com/joquijada/aws-sdk-wrappers/commit/42632a787545a28ee424955e53c71a1b89098ff0))

# [1.4.0](https://github.com/joquijada/aws-sdk-wrappers/compare/v1.3.0...v1.4.0) (2021-12-08)


### Features

* **dynamdb:** copyTable method ([3ab91ed](https://github.com/joquijada/aws-sdk-wrappers/commit/3ab91ed9ae8cea7c59bd4371ac1cc92f5d4cfbf6))

# [1.3.0](https://github.com/joquijada/aws-sdk-wrappers/compare/v1.2.4...v1.3.0) (2021-12-03)


### Features

* **dynamdb:** expose scan command ([a9e95ff](https://github.com/joquijada/aws-sdk-wrappers/commit/a9e95ff5b85a87a7f462323333361d2ba4cf6c8b))

## [1.2.4](https://github.com/joquijada/aws-sdk-wrappers/compare/v1.2.3...v1.2.4) (2021-11-24)


### Bug Fixes

* **http-response:** allow user to define 'body' explicitly ([4647ec7](https://github.com/joquijada/aws-sdk-wrappers/commit/4647ec7b0a8a7dad0e0eb161357348559c2ff6b9))

## [1.2.3](https://github.com/joquijada/aws-sdk-wrappers/compare/v1.2.2...v1.2.3) (2021-11-24)


### Bug Fixes

* **lambda:** updates http response to match Lambda/APIG proxy integration output ([025ece2](https://github.com/joquijada/aws-sdk-wrappers/commit/025ece2fe8c7e1fd1824bd223852df98efbd04af))

## [1.2.2](https://github.com/joquijada/aws-sdk-wrappers/compare/v1.2.1...v1.2.2) (2021-11-24)


### Bug Fixes

* **lambda:** update output to reflect apig api ([9afd6a7](https://github.com/joquijada/aws-sdk-wrappers/commit/9afd6a738b9a16b0ec3ce1193c532b91a039a54c))

## [1.2.1](https://github.com/joquijada/aws-sdk-wrappers/compare/v1.2.0...v1.2.1) (2021-11-15)


### Bug Fixes

* **dynamo:** add ts types ([1a43385](https://github.com/joquijada/aws-sdk-wrappers/commit/1a4338502356d6e4224e6ea602064ab9582a1d22))

# [1.2.0](https://github.com/joquijada/aws-sdk-wrappers/compare/v1.1.5...v1.2.0) (2021-11-15)


### Features

* **dynamo:** expose the client ([c77f07e](https://github.com/joquijada/aws-sdk-wrappers/commit/c77f07e9728c64ae095f9ff16673d7a450a4a3c3))

## [1.1.5](https://github.com/joquijada/aws-sdk-wrappers/compare/v1.1.4...v1.1.5) (2021-11-14)


### Bug Fixes

* **publish:** see if this fixes commit missing assets issue ([7fc2314](https://github.com/joquijada/aws-sdk-wrappers/commit/7fc2314823e1c98b3007eba8853b731555538d75))
* **publish:** see if this fixes commit missing assets issue ([6a4e4b1](https://github.com/joquijada/aws-sdk-wrappers/commit/6a4e4b1b0e4480e87f0c1a173f3eabe4cd8e46b6))

## [1.1.4](https://github.com/joquijada/aws-sdk-wrappers/compare/v1.1.3...v1.1.4) (2021-11-14)


### Bug Fixes

* **publish:** add missing assets ([5809ea5](https://github.com/joquijada/aws-sdk-wrappers/commit/5809ea54b89eda6a03bc58bc85dda4ca7f8e1ffa))
* **release:** fix sr github plugin config yaml syntax ([521732b](https://github.com/joquijada/aws-sdk-wrappers/commit/521732b0ff57f4e9d7d307673fb9bd02a1f9b90c))

## [1.1.3](https://github.com/joquijada/aws-sdk-wrappers/compare/v1.1.2...v1.1.3) (2021-11-14)


### Bug Fixes

* **publish:** add missing assets ([69e8763](https://github.com/joquijada/aws-sdk-wrappers/commit/69e8763ac02af909a787efd94987d7597c84dc61))
* **publish:** add missing assets ([5e791cc](https://github.com/joquijada/aws-sdk-wrappers/commit/5e791ccaa1c50e0ec0db22fbece08433ace76325))
