---
title: Authentication & Authorization
description: AuthN vs AuthZ, sessions vs JWTs, OAuth2 and OIDC flows, RBAC vs ABAC, and mTLS for zero-trust service-to-service.
sidebar:
  order: 3
---

Every system that has users needs to answer two different questions. Mixing them up is one of the most common interview tells, so keep them crisp.

## AuthN vs AuthZ — the two questions

- **Authentication (authN) = "who are you?"** — proving identity. Login, MFA, tokens.
- **Authorization (authZ) = "what are you allowed to do?"** — gating actions once identity is known.

> A valid login (authN) does **not** mean you can delete another user's payment (authZ). You check identity first, then permission.

## How identity is carried: sessions vs tokens

After login, the system needs to remember who you are on each request. Two approaches:

| | **Session (stateful)** | **JWT / token (stateless)** |
| --- | --- | --- |
| Where state lives | On the server (session store) | In the signed token itself |
| Each request sends | A session id (cookie) | The whole signed token |
| Revoke instantly? | **Yes** — delete the session | **Hard** — valid until it expires |
| Scales how | Needs shared session store | No server lookup — scales freely |

**Do this:**

- **Sessions** when you need instant revocation and have a shared store (Redis) — e.g. a banking web app.
- **JWTs** when you want stateless, cross-service auth — but keep TTL **short** (minutes) and pair with a **refresh token** so a leaked token dies fast. → revocation is the JWT weakness; short TTL is the mitigation.

:::caution[Trap to avoid]
**A JWT can't be un-issued.** If it's valid for 24h and it leaks, the attacker has 24h. Use short-lived access tokens (~5–15 min) + a refresh token you *can* revoke. Never put secrets in a JWT — it's signed, not encrypted; anyone can read the payload.
:::

## OAuth2 + OIDC

The standard for "let users log in" and "let app A act on behalf of a user in app B."

- **OAuth2** = **authorization** framework — issues access tokens so a client can call an API on a user's behalf.
- **OIDC** (OpenID Connect) = a thin **authentication** layer on top of OAuth2 — adds an **ID token** that says *who* the user is. ("Sign in with Google" is OIDC.)

**The four roles:**

- **Resource owner** — the user.
- **Client** — the app wanting access.
- **Authorization server** — issues tokens (e.g. Google, Auth0, Cognito).
- **Resource server** — the API that holds the data and trusts the token.

**The two flows you'll mention:**

- **Authorization Code + PKCE** — for user login from web/mobile apps. The app gets a short code, swaps it for tokens server-side; PKCE stops the code being stolen. This is the default for user-facing apps.
- **Client Credentials** — for **service-to-service** with no user (machine-to-machine). The service authenticates as itself.

:::note[Go deeper · Tech Unpack]
[Passkeys: Log In Smarter, Not Harder →](https://technunpack.substack.com/p/passkeys-log-in-smarter-not-harder) — how passwordless authentication works, and why it's replacing passwords.
:::

## Authorization models: RBAC vs ABAC

How you decide *what* an authenticated user can do:

- **RBAC (Role-Based)** — permissions attach to **roles**, users get roles. *"Admins can refund; support can view."* Simple, covers most systems.
- **ABAC (Attribute-Based)** — permissions are computed from **attributes/context**. *"A manager can approve a payment **only if** amount < $10k **and** it's in their region."* More powerful, more complex.

:::tip[Principal Move]
Start with **RBAC** — it's enough for most systems and easy to reason about. Move to **ABAC** only when decisions genuinely depend on context (amount, time, location, ownership). And enforce **separation of duties**: the person who *initiates* a payment must not be the one who *approves* it.
:::

## Service-to-service: mTLS & zero-trust

Inside the system, services also need to authenticate **each other**:

- **mTLS (mutual TLS)** — both sides present certificates, so each proves its identity. Not just the server proving itself to the client — both directions.
- This is the basis of **zero-trust**: *never trust the network, always verify.* A request from "inside" the network is not automatically trusted.
- Apply **least privilege** — each service can reach only what it needs.

:::note[Key Idea]
**authN proves who; authZ gates what.** Carry identity with short-lived tokens (or revocable sessions), authorize with RBAC (escalate to ABAC for contextual rules), and authenticate services to each other with mTLS under a zero-trust posture. The rest of the security surface — encryption, tokenization, fraud, abuse — is in [Security & Risk](../../concepts/security/).
:::
