# Pull Request Rules

## Consistency First

If the repository has a **pull request template**, follow it. The rules below are defaults - the repo template takes priority.

## Branch

- Create a new branch from `main` before making changes (unless already on a feature branch)
- Naming convention:
  - With GitHub issue: `feature/gh-<issue number>` (e.g., `feature/gh-42`)
  - Without issue: `feature/<short-description>` (e.g., `feature/add-login-validation`)

## Default Style

- **Title**: Same rules as commit messages - plain English, imperative mood

- **Body**: Use the following structure. All sections can be omitted if obvious:

  #### Motivation

  Why is this change needed? What problem does it solve?

  #### Modifications

  What was changed? Summarize the key changes at a high level.

  #### Result

  What is the outcome? How can reviewers verify it works?
