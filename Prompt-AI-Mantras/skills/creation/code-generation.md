# Code Generation

## Purpose
Write new code that is correct, maintainable, secure, and follows established patterns and conventions. This skill enables creation of functional code components from requirements.

## When to Use
- Implementing new features
- Creating utilities or helper functions
- Building boilerplate or scaffolding
- Writing tests
- Prototyping solutions

## Inputs Required
- **Requirements**: What the code should do
- **Language/Framework**: Target technology stack
- **Context**: Surrounding codebase, existing patterns
- **Constraints**: Performance, security, compatibility requirements
- **Style**: Coding standards and conventions to follow

## Outputs Produced
- Functional code meeting requirements
- Inline comments for complex logic
- Type definitions (if applicable)
- Basic error handling
- Test suggestions or test code

## Invocation
```
[Applying code-generation skill]
Requirements: {what the code should accomplish}
Language: {programming language}
Framework: {framework if applicable}
Context: {existing code patterns to follow}
Constraints: {performance, security, compatibility}
Style: {coding standards}
```

## Constraints
- Cannot execute generated code
- May require adaptation to specific codebase
- Security-sensitive code needs expert review
- Generated tests need validation
- Should not introduce new dependencies without justification

## Example Usage

**Scenario**: Kestra implementing rate limiting middleware

```
[Kestra applying code-generation skill]
Requirements: Rate limit API endpoints, configurable per-route, return 429 when exceeded
Language: TypeScript
Framework: Express.js
Context: Existing middleware pattern in /middleware folder
Constraints: Must support distributed deployment (Redis-backed)
Style: Project eslint config, async/await pattern

---
// middleware/rateLimit.ts
import { Request, Response, NextFunction } from 'express';
import Redis from 'ioredis';

interface RateLimitConfig {
  windowMs: number;      // Time window in milliseconds
  maxRequests: number;   // Max requests per window
  keyGenerator?: (req: Request) => string;
  skip?: (req: Request) => boolean;
}

const defaultKeyGenerator = (req: Request): string => {
  // Use forwarded IP if behind proxy, with validation
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded && process.env.TRUST_PROXY === 'true') {
    const ip = Array.isArray(forwarded) ? forwarded[0] : forwarded.split(',')[0];
    return `ratelimit:${ip.trim()}`;
  }
  return `ratelimit:${req.ip}`;
};

export function createRateLimiter(redis: Redis, config: RateLimitConfig) {
  const {
    windowMs,
    maxRequests,
    keyGenerator = defaultKeyGenerator,
    skip
  } = config;

  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (skip?.(req)) {
      return next();
    }

    const key = keyGenerator(req);
    const windowStart = Math.floor(Date.now() / windowMs);
    const redisKey = `${key}:${windowStart}`;

    try {
      const current = await redis.incr(redisKey);

      if (current === 1) {
        await redis.pexpire(redisKey, windowMs);
      }

      res.setHeader('X-RateLimit-Limit', maxRequests);
      res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - current));

      if (current > maxRequests) {
        res.status(429).json({
          error: 'Too many requests',
          retryAfter: Math.ceil(windowMs / 1000)
        });
        return;
      }

      next();
    } catch (error) {
      // Fail open: allow request if Redis is unavailable
      console.error('Rate limit check failed:', error);
      next();
    }
  };
}
---

Usage:
const limiter = createRateLimiter(redis, { windowMs: 60000, maxRequests: 100 });
app.use('/api/', limiter);

Tests to write:
- Should allow requests under limit
- Should block requests over limit with 429
- Should reset after window expires
- Should fail open if Redis unavailable
```

## Recommended Personas
- **Kestra**: Infrastructure, backend, DevOps code
- **Ada**: Test code, quality tooling

## Related Skills
- `code-review`: For reviewing generated code
- `codebase-exploration`: For understanding existing patterns
- `security-audit`: For security-sensitive code review
