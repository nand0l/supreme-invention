# Website

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

## Installation

I used the [Itrocuction](https://docusaurus.io/docs) at this sit to get me started.

```bash
npx create-docusaurus@latest my-website-demo classic --typescript
```

where `my-website-demo` is the folder where you want to deploy your local code

## Local Development

T start the site for local development run:

```bash
npm start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

## Remote Repository

I created a private rpository on github and in itialized the local folder:

```bash

git init
git add .
git commit -m "first commit"
git branch -M main


git remote add origin https://github.com/nand0l/supreme-invention.git
git remote add origin 
git push -u origin main
```

## local build test

The loca folder is: `C:\code\docusaurus\supreme-invention`

```bash
npm run build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## Deployment

I will use AWS Amplify to host this app
