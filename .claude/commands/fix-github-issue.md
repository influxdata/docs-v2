Please analyze and fix the GitHub issue: $ARGUMENTS.

Follow these steps:

1.  Get the issue details (use GitHub MCP tools or `gh issue view`)
2.  Understand the problem described in the issue
3.  **Investigate**: Follow the `issue-investigation` skill to verify the problem is real,
    check whether a fix already exists, and identify the root cause. Do not skip
    this step — open issues are not proof the problem still exists.
4.  Search the codebase for relevant files, using your knowledge of the project
    structure and the issue description
5.  Implement the necessary changes to fix the issue
6.  Write and run tests (store in `tests/` directory) to verify the fix
7.  Create a descriptive commit message
8.  Ensure code passes linting and type checking
9.  Push
10. Ensure code passes pre-push tests
11. Create a PR