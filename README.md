# PetIP OS

PetIP OS is an internal operating system for pet-IP positioning, natural content production, e-commerce planning, and live-stream review.

The first release provides:

- an internal employee workspace with project-scoped access;
- an eight-module diagnosis and three-option positioning workflow;
- creator voice profiles and AI-style review records;
- content draft, human revision, review, and approval history;
- product-fit assessment, live-room positioning, scripts, metrics, and reviews;
- a normalized Prisma data model with auditable demo data.

## Local development

Use the bundled Node.js runtime or any Node.js 20+ installation.

```bash
cp .env.example .env
pnpm install
pnpm db:generate
pnpm db:migrate
pnpm db:seed
pnpm dev
```

Run all checks with:

```bash
pnpm check
```

The current UI is a functional internal-operations prototype backed by typed demo data. The Prisma schema and seed establish the server-side contract for the next API phase.

## Documentation

- [Product requirements](docs/PRD.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Positioning framework](docs/POSITIONING_FRAMEWORK.md)
- [Voice style system](docs/VOICE_STYLE_SYSTEM.md)
- [Live commerce system](docs/LIVE_COMMERCE_SYSTEM.md)
- [RBAC](docs/RBAC.md)
- [Report workflow](docs/REPORT_REVIEW_WORKFLOW.md)
- [Security](docs/SECURITY.md)
- [Knowledge policy](docs/KNOWLEDGE_POLICY.md)
- [Implementation plan](docs/IMPLEMENTATION_PLAN.md)
