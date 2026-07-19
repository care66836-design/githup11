# Live Commerce System

## 1. Principle

The live module starts with IP and operational fit, not generic sales scripts. The system first decides whether and how the creator should sell, then aligns products, room positioning, scripts, metrics, and review.

## 2. Capability assessment

Assess host format, expert/companion/review style, pet appearance, strong versus weak sales, session length/frequency, control, comment handling, sustained explanation, negative feedback, supply, customer service, and after-sales capacity.

Output one of: not ready, content-first test, short diagnostic live, regular weak-sales live, or scaled commerce live. Readiness is separate from revenue potential.

## 3. Live-room profile

`LiveRoomProfile` defines:

- one-sentence positioning;
- host and pet roles;
- target audience and core scenario;
- retention, trust, and purchase reasons;
- category and price-band strategy;
- host and visual styles;
- repeatable rhythm, pet appearance plan, and sales intensity.

Profiles are versioned. A material positioning change creates a new version rather than overwriting historical sessions.

## 4. Product matrix

| Role | Job |
| --- | --- |
| Traffic | Low-friction first click or purchase |
| Hero | Best balance of IP fit, user value, conversion, and margin |
| Profit | Higher margin/order value requiring stronger trust |
| Image | Reinforces brand and expertise even without highest sales |
| Cross-sell | Completes the scenario and raises order value |

`ProductFitAssessment` scores IP fit, audience fit, short-video fit, live fit, display/explanation difficulty, after-sales/refund risk, margin, commission, and recommendation. High margin never overrides a poor IP or fulfillment fit.

## 5. Script structure

Scripts consist of typed, ordered `LiveScriptBlock` records:

1. opening and room identity;
2. retention and interaction;
3. need diagnosis;
4. scene demonstration and product explanation;
5. size/suitability guidance;
6. objection and price handling;
7. conversion and cross-sell;
8. cold-room and negative-comment handling;
9. closing summary and next-session preview.

Every 15-30 minutes the room repeats identity, pain point, demonstration, explanation, objection handling, and action. Exact language is rewritten from the approved creator voice profile.

## 6. Metrics

Session metrics include duration, viewers, average/peak concurrent viewers, entry rate, watch time, interaction, product click, click-to-order, revenue per thousand views, GMV, units, order value, refund, followers, and follow conversion.

Variable platform breakdowns are retained as immutable JSON source snapshots. Normalized top-level metrics support comparisons and dashboards.

## 7. Review

Each finding is classified as traffic, retention, trust, product, script, conversion, or fulfillment/refund. It includes severity, evidence, and a next-session recommendation.

The review must distinguish correlation from causation. A script node associated with orders is a lead for testing, not proof that the wording caused conversion.

Next-session actions should be observable, for example “move size demonstration into the first five minutes,” rather than “improve retention.”

## 8. Welfare and compliance

- Pet appearance plans include duration, rest, environment, and a stop condition.
- Scripts do not make unsupported health, safety, efficacy, scarcity, or price claims.
- Suitability and size recommendations state limits clearly.
- Refund and after-sales signals are reviewed alongside GMV.

