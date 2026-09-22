@AGENTS.md

# Git workflow (always follow, every session)

- **Never commit directly to `main`.** `main` is the protected/shared
  branch — treat it as read-only from the working tree's perspective.
- **Never force-push, rewrite history on, or delete `main` or any other
  existing branch** without the user explicitly asking for that specific
  action in that turn. This includes branches other than `main`.
- **While a PR of mine is still open, keep working on that same
  branch.** Don't open a second branch off `main` for follow-up work
  while the previous one is unmerged: two branches editing the same
  files produce merge conflicts I then have to resolve by hand. Commit
  to the open branch and let the existing PR pick the commits up. Start
  a new branch only once that PR is merged (or closed).
- When starting fresh work with **no PR of mine open**:
  1. Fetch the latest `main` (`git fetch origin main`).
  2. Create a **new branch from `main`** (`git checkout -B <branch-name>
     origin/main`). Never build a change on top of a stale branch, or on
     a branch whose PR already merged.
  3. Commit the work there, run the project's lint/build checks, then
     push that branch (`git push -u origin <branch-name>`).
  4. **Always open a pull request** for that branch targeting `main` —
     don't consider a change finished until a PR exists for it, and
     don't leave a pushed branch without a PR.
  5. Subscribe to the PR's activity and drive it to green per the
     standing PR rules (fix CI failures, address review comments, etc.).
- If `main` moves ahead while my branch is open (someone merges another
  PR), merge `main` into the branch and resolve it there, rather than
  leaving the PR conflicted.
