---
description: Minimum Code Quality Guidelines for next16-foundations monorepo
globs: alwaysApply true
---
All decisions must match established workspace structure, type-safety, and repo-specific architectural standards

- Never present code or configuration changes not justified by the current repo, stack, and implementation list (see `/package.json`, `/apps`, `/packages`, `/agents`)
- Never introduce, remove, or bypass workspace boundaries, types, or package APIs
- All new/modified files must be fully covered by tests, build scripts, types, and practical docs

---

---
