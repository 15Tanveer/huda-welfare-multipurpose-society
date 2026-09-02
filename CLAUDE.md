@AGENTS.md

# Git workflow (always follow, every session)

- **Never commit directly to `main`.** `main` is the protected/shared
  branch — treat it as read-only from the working tree's perspective.
- **Never force-push, rewrite history on, or delete `main` or any other
  existing branch** without the user explicitly asking for that specific
  action in that turn. This includes branches other than `main`.
- For every change, however small:
  1. Fetch the latest `main` (`git fetch origin main`).
  2. Create a **new branch from `main`** (`git checkout -B <branch-name>
     origin/main`). Never build a change on top of a stale or unrelated
     branch.
  3. Commit the work there, run the project's lint/build checks, then
     push that branch (`git push -u origin <branch-name>`).
  4. **Always open a pull request** for that branch targeting `main` —
     don't consider a change finished until a PR exists for it, and
     don't leave a pushed branch without a PR.
  5. Subscribe to the PR's activity and drive it to green per the
     standing PR rules (fix CI failures, address review comments, etc.).
- One logical change per branch/PR. Don't stack unrelated work onto a
  branch that already has an open PR for something else — start a fresh
  branch from `main` instead.
- This applies regardless of how the previous branch's PR was resolved
  (merged or closed) — always re-branch from the current `main`, never
  reuse or build on top of a branch whose PR already merged.
