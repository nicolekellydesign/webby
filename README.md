# Webby

[![License](https://img.shields.io/github/license/nicolekellydesign/webby.svg)]()

This is the Content Management System (CMS) for graphic designer and photographer Nicole Kelly. It aims to have a simple and easy to use management interface powering an intuitive and stylistic public-facing site.

Webby is built using TypeScript and React with [Chakra UI](https://chakra-ui.com/). It is powered by [Webby API](https://github.com/nicolekellydesign/webby-api), a backend API and database manager written in Go.

## Building and Installation

To build Webby, you need NodeJS 16 and Yarn.

The app needs an environment variable while building to enable the email feature to function:
`VITE_EMAIL_TOKEN`.

First, run `yarn install` to download the project's dependencies.

Then, run `yarn build` to build the webapp.
One way to pass the needed environment variable to Yarn is like this:
`VITE_EMAIL_TOKEN=<token> yarn build`

Once that completes, the webapp is ready to deploy in the `build/` folder.

## License

Copyright &copy; 2021 NicoleKellyDesign

This project is licensed under the terms of the Apache 2.0 license.
