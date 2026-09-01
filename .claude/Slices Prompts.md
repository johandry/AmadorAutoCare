# Prompts

## Iterate Feature by Feature

```text
I'm building AmadorAutoCare. There is a PRD file (`./PRD.md`) as well as context file (`./AGENTS.md`) for context.

We have already implemented ths slice number S00 located in file `./docs/SLICES.md`

The project has a file/folder structure. Now implement this slice: **S01** located in `./docs/SLICES.md`

Requirements for this slice:

- [bullet from PRD]
- [bullet from PRD]

Write tests for this slice. Cover:

- The core happy path
- Key edge cases and error states
- Any boundary conditions mentioned in the PRD

Constraints:

- Stack: HTML, JavaScript, CSS, Supabase if required
- Follow existing conventions in the codebase
- Do not modify files outside the scope of this slice
- Write clean, readable code with comments where logic is non-obvious
- Mock external dependencies (APIs, DB, auth) rather than hitting them directly
- Each test should have a clear description of what it's verifying

Output: provide all files that need to be created or modified, with full file contents.

When finish, provide a git commit short message
```