# Document Generation

## Purpose
Create structured, well-organized documents that effectively communicate information to their intended audience. This skill enables production of various document types with appropriate format, tone, and content.

## When to Use
- Creating reports, proposals, or plans
- Writing technical documentation
- Producing user-facing content
- Drafting formal communications
- Generating templates for repeated use

## Inputs Required
- **Document type**: Report, proposal, guide, memo, etc.
- **Audience**: Who will read this document
- **Purpose**: What the document should accomplish
- **Content**: Key information to include
- **Format requirements**: Length, structure, style guide
- **Tone**: Formal, technical, conversational, etc.

## Outputs Produced
- Complete document with appropriate structure
- Executive summary (if applicable)
- Supporting sections and appendices
- Proper formatting and hierarchy
- Citations/references (if needed)

## Invocation
```
[Applying document-generation skill]
Type: {document type}
Audience: {target readers}
Purpose: {document goal}
Content: {key points to include}
Format: {length, structure requirements}
Tone: {formal|technical|conversational|etc.}
```

## Constraints
- Cannot include images (describe placement only)
- Length estimates are approximate
- May need domain expert review for technical accuracy
- Should follow organizational templates when provided
- Must cite sources for factual claims

## Example Usage

**Scenario**: Hopper generating project kickoff document

```
[Hopper applying document-generation skill]
Type: Project kickoff document
Audience: Development team, stakeholders
Purpose: Align team on project scope, timeline, and responsibilities
Content: Project goals, scope, team roles, milestones, risks, communication plan
Format: 3-5 pages, standard project template
Tone: professional, clear

---
# Project Kickoff: Authentication System Modernization

## Executive Summary
This project modernizes our authentication system to support SSO, improve security posture, and reduce login friction. Target completion: Q2.

## Project Overview
### Goals
1. Implement SAML/OIDC SSO integration
2. Add MFA support across all user types
3. Migrate from session-based to JWT authentication

### Scope
**In Scope:**
- SSO provider integration (Okta, Azure AD)
- MFA implementation (TOTP, WebAuthn)
- JWT token management
- Migration tooling for existing sessions

**Out of Scope:**
- Password policy changes (separate initiative)
- Mobile app authentication (Phase 2)

## Team & Responsibilities
| Role | Person | Responsibilities |
|------|--------|------------------|
| Tech Lead | [Name] | Architecture decisions, code review |
| Backend Dev | [Name] | API implementation, token management |
| Frontend Dev | [Name] | Login UI, MFA enrollment flows |
| QA | [Name] | Test planning, security testing |

## Milestones
[...]

## Risks & Mitigations
[...]

## Communication Plan
[...]
---
```

## Recommended Personas
- **Hopper**: Project plans, kickoff documents, status reports
- **Clara**: Financial reports, investment memos
- **Kestra**: Technical documentation, architecture docs
- **Watson**: Medical summaries, patient communications
- **Franklin**: Research reports, analysis documents

## Related Skills
- `plan-drafting`: For detailed project planning
- `summarization`: For condensing existing content
- `report-writing`: For analytical reports specifically
