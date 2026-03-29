# Commit Message Rules

## Consistency First

Before writing a commit message, check recent commit history (`git log`) and **follow the existing style** of the repository. The rules below are defaults - if the repo uses a different convention, match that instead.

## Default Style

- **Title**: Plain English sentence, concise (under ~72 characters)
  - Use imperative mood (e.g., "Add login validation" not "Added login validation")
  - Do NOT use conventional commit prefixes (`feat:`, `fix:`, etc.) unless the repo already does
- **Body**: Optional. Include only when the "why" isn't obvious from the title
  - Separate from title with a blank line
  - Wrap at ~72 characters
