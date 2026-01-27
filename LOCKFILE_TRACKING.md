# Lockfile Tracking & Build Determinism

## Issue Fixed
The root `.gitignore` was ignoring `package-lock.json` globally, preventing deterministic npm installs across environments.

## Changes Made

### 1. Updated `.gitignore`
**Removed:** Global `package-lock.json` exclusion (line 8)

**Before:**
```
# Dependencies
node_modules/
package-lock.json
yarn.lock
```

**After:**
```
# Dependencies
node_modules/
yarn.lock

# Only ignore lockfiles for tools, not project lockfiles
# package-lock.json files are tracked for deterministic installs
```

### 2. Lockfiles Now Tracked
Both project lockfiles are now committed to Git:
- `backend/package-lock.json` ✅
- `frontend/package-lock.json` ✅

## Benefits

| Aspect | Impact |
|--------|--------|
| **Deterministic Builds** | Identical dependencies across all environments (local, CI/CD, production) |
| **Security** | Dependency hash verification prevents supply chain attacks |
| **Reproducibility** | Exact versions locked - no unexpected updates during deployment |
| **CI/CD Reliability** | No `npm install` version drift between pipeline runs |
| **Onboarding** | New developers get exact same dependency versions |

## What's Still Ignored
✅ `node_modules/` directories (artifact, not tracked)
✅ `yarn.lock` (using npm, yarn lock not needed)
✅ `.env` files (secrets)
✅ Build outputs (`dist/`, `build/`, `.next/`)
✅ IDE configs (`.vscode/`, `.idea/`)
✅ Logs and temporary files

## Verification
```bash
# Confirm lockfiles are tracked
git ls-files | grep package-lock.json

# Confirm lockfiles are NOT ignored
git check-ignore backend/package-lock.json frontend/package-lock.json
# Expected: No output (exit code 1 = not ignored)
```

## Production Deployment Impact
- `npm ci` (CI mode) will use exact locked versions
- Zero version variance between staging and production
- Predictable dependency tree - no "it works on my machine" surprises

## No Code Changes
- ✅ Application logic unchanged
- ✅ Existing folder structure preserved
- ✅ No refactoring
- ✅ No feature modifications
- ✅ Production-grade and recruiter-friendly
