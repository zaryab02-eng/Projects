# Multi-Business Platform

## Project

A monorepo for a central business administration application, a separately
deployable customer storefront, a shared API worker, and shared domain types.

## Current stage: structure only

The repository currently contains the agreed project layout and placeholder
entry points only. No authentication, business workflows, data models,
Firestore integration, uploads, or storefront features have been implemented.

## Applications and services

- `apps/admin`: central admin and business-owner application.
- `apps/storefront`: shared customer storefront code, with themes and isolated
  per-client overrides.
- `workers/api`: Cloudflare Worker API.
- `packages/shared`: shared types, schemas, and category definitions.
- `firebase`: Firestore rules, indexes, and Firebase CLI configuration.

## Local development

Install dependencies from the repository root with `npm install`. Start a
workspace with `npm run dev:admin`, `npm run dev:storefront`, or
`npm run dev:api`.

Copy `.env.example` to a local environment file when environment variables are
introduced. Never put real secrets in the repository.

## Handover

This file is the project handover. Update the current stage, completed work,
verification, and known next steps as development progresses.

