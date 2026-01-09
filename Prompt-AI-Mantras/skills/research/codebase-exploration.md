# Codebase Exploration

## Purpose
Navigate, understand, and map code repositories to build context for development, review, or architectural decisions. This skill enables systematic discovery of code structure, patterns, and relationships.

## When to Use
- Onboarding to an unfamiliar codebase
- Understanding how a feature is implemented
- Finding where to make changes
- Mapping dependencies and relationships
- Preparing for code review or refactoring

## Inputs Required
- **Repository**: Path or location of codebase
- **Objective**: What you're trying to understand or find
- **Depth**: Surface overview vs. deep dive
- **Focus areas**: Specific directories, file types, or patterns of interest

## Outputs Produced
- Codebase structure map
- Key file identification
- Pattern recognition (architecture, conventions)
- Dependency relationships
- Entry points and flow paths
- Areas of complexity or technical debt

## Invocation
```
[Applying codebase-exploration skill]
Repository: {path}
Objective: {what to understand}
Depth: {surface|moderate|deep}
Focus: {specific areas or patterns}
```

## Constraints
- Cannot execute code (analysis only)
- Large codebases require targeted exploration
- May miss dynamically generated or external code
- Understanding requires domain context
- Should respect .gitignore and sensitive files

## Example Usage

**Scenario**: Kestra needs to understand authentication flow before security audit

```
[Kestra applying codebase-exploration skill]
Repository: /project/backend
Objective: Map authentication and authorization flow
Depth: deep
Focus: auth/, middleware/, routes/*auth*

Findings:
1. Structure:
   - auth/providers/ - OAuth, JWT, local auth implementations
   - middleware/auth.js - Request authentication middleware
   - routes/auth.js - Login, logout, refresh endpoints

2. Flow:
   POST /auth/login -> auth.js -> providers/local.js -> JWT issued

3. Key Files:
   - auth/providers/jwt.js:45 - Token generation
   - middleware/auth.js:12 - Token validation

4. Observations:
   - JWT secret loaded from env (good)
   - No rate limiting on login endpoint (concern)
   - Refresh token rotation not implemented (concern)
```

## Recommended Personas
- **Kestra**: Architecture understanding, security review prep
- **Ada**: Code review preparation, quality assessment
- **Hopper**: Task scoping, effort estimation

## Related Skills
- `code-review`: For detailed code quality assessment
- `security-audit`: For security-focused analysis
- `diagram-creation`: For visualizing findings
