

## Description

This project build for an education purpose only using [Nest.js](https://github.com/nestjs/nest), [Typescript](https://www.typescriptlang.org/), nodeMailar.

## Installation

```bash
$ npm install
$ npm install --force #in the case of ts-jest could problem.
```

## Config .env
```
create .env file root of the folder and insert value according to env.example
```

## Database migrations
```bash
npm run make:migration-initial #To build a schema 
npm run migrate #To migration
npm run migrate:rollback #To rollback migration
npm run migrate:destroy #To destory all migrations
```


## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Add Data
You can import postman script available at `./postman/FairTask.postman_collection.json` simply import this file to your postman and hit collection/create api.

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Er. Ronak Amlani](https://www.erronak.com)
- Portfolio work - [Techacorn](https://www.techacorn.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
