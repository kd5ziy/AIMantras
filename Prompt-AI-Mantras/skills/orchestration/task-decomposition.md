# Task Decomposition

## Purpose
Break complex tasks into smaller, manageable subtasks that can be assigned, tracked, and completed independently. This skill enables effective planning and parallel execution.

## When to Use
- Starting a complex project or initiative
- Planning sprints or work cycles
- Delegating work across team members or personas
- Estimating effort and dependencies
- Creating actionable work items from vague requirements

## Inputs Required
- **Task**: The complex task to decompose
- **Context**: Background, constraints, stakeholders
- **Granularity**: Desired subtask size (hours, days, story points)
- **Resources**: Available personas, skills, or team members
- **Dependencies**: Known blockers or prerequisites

## Outputs Produced
- Hierarchical task breakdown
- Subtask descriptions with clear scope
- Dependency graph
- Persona/skill assignments
- Suggested sequencing
- Risk or uncertainty flags

## Invocation
```
[Applying task-decomposition skill]
Task: {complex task description}
Context: {background and constraints}
Granularity: {target subtask size}
Resources: {available personas/skills}
Dependencies: {known prerequisites}
```

## Constraints
- Decomposition depth depends on information available
- May need iteration as understanding improves
- Cannot decompose without clear end goal
- Should flag ambiguous requirements for clarification
- Over-decomposition adds overhead; find right granularity

## Example Usage

**Scenario**: Hopper decomposing authentication modernization project

```
[Hopper applying task-decomposition skill]
Task: Modernize authentication system with SSO and MFA
Context: Legacy session-based auth, 50k users, Q2 deadline
Granularity: 1-3 day subtasks
Resources: Kestra (architecture), Ada (QA), domain devs
Dependencies: SSO provider contract must be signed first

Task Decomposition:

## Phase 1: Foundation (Week 1-2)
1.1 **Architecture Design** [Kestra, 2 days]
    - Document current auth flow
    - Design target state with SSO/MFA
    - Define migration strategy
    Dependencies: None
    Skills: codebase-exploration, diagram-creation

1.2 **SSO Provider Integration Setup** [Dev, 2 days]
    - Configure Okta/Azure AD tenant
    - Set up dev environment integration
    - Document provider configuration
    Dependencies: 1.1, SSO contract signed
    Skills: document-generation

1.3 **JWT Infrastructure** [Dev, 3 days]
    - Implement JWT generation/validation
    - Add refresh token rotation
    - Create token revocation mechanism
    Dependencies: 1.1
    Skills: code-generation, security-audit

## Phase 2: Core Implementation (Week 3-4)
2.1 **SSO Login Flow** [Dev, 3 days]
    - SAML/OIDC callback handling
    - User provisioning from SSO
    - Session creation from SSO token
    Dependencies: 1.2, 1.3
    Skills: code-generation

2.2 **MFA Implementation** [Dev, 3 days]
    - TOTP enrollment flow
    - TOTP verification
    - Recovery codes generation
    Dependencies: 1.3
    Skills: code-generation, security-audit

2.3 **Legacy Auth Adapter** [Dev, 2 days]
    - Bridge old sessions to new JWT
    - Gradual migration support
    Dependencies: 1.3
    Skills: code-generation

## Phase 3: Migration & QA (Week 5-6)
3.1 **Migration Tooling** [Dev, 2 days]
    - Batch session migration script
    - Rollback capability
    Dependencies: 2.3
    Skills: code-generation

3.2 **Security Audit** [Rickover, 2 days]
    - Full security review of new auth
    - Penetration testing coordination
    Dependencies: 2.1, 2.2
    Skills: security-audit, risk-assessment

3.3 **QA & Testing** [Ada, 3 days]
    - Test plan creation
    - Integration testing
    - User acceptance testing
    Dependencies: 2.1, 2.2, 2.3
    Skills: quality-check

## Dependency Graph:
1.1 → 1.2 → 2.1 → 3.2
1.1 → 1.3 → 2.1, 2.2, 2.3 → 3.1, 3.2, 3.3

## Risks Flagged:
- SSO contract timing could delay 1.2
- MFA complexity may exceed estimate
- Migration may need extended parallel-run period
```

## Recommended Personas
- **Hopper**: Primary task decomposition and planning
- **Bernstein**: High-level strategic decomposition
- **Lovell**: Crisis/time-constrained decomposition

## Related Skills
- `plan-drafting`: For formalizing decomposition into plans
- `constraint-gathering`: For clarifying requirements
- `progress-tracking`: For monitoring decomposed tasks
- `risk-assessment`: For identifying task risks
