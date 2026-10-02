# Monorepo template
This is a template for creating mono-repositores (`monorepos`).

We use [Moon](https://moonrepo.dev/) as our tool to handle monorepos.

This repos includes the minimal configuration for using `Moon`, including
the settings for using the `apps` and `packages` directories to store
applications hosted by the monorepo.

## How to add applications to the monerepo

Let's say you want to host two applications in your monorepo called `users` and
`auth`. You'll need to create two folders for those:

* projects/users
* projects/auth

Then, you can place your code files inside the created directores.

## CI (Continous Integration)

This repo also includes a minimal `GitHub Actions` workflow for CI.