/**
 * Assign Copilot to Issue
 * Assigns the GitHub Copilot coding agent to an issue via GraphQL, triggered
 * by applying the `copilot:fix` label.
 *
 * Usage: Called from GitHub Actions via actions/github-script
 * (see .github/workflows/assign-copilot-on-label.yml)
 */

export const COPILOT_LOGIN = 'copilot-swe-agent';

const SUGGESTED_ACTORS_QUERY = `
  query($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      suggestedActors(capabilities: [CAN_BE_ASSIGNED], first: 100) {
        nodes {
          login
          __typename
          ... on Bot { id }
          ... on User { id }
        }
      }
    }
  }
`;

const ISSUE_ASSIGNEES_QUERY = `
  query($owner: String!, $name: String!, $number: Int!) {
    repository(owner: $owner, name: $name) {
      issue(number: $number) {
        id
        assignees(first: 20) {
          nodes { id login }
        }
      }
    }
  }
`;

const REPLACE_ASSIGNEES_MUTATION = `
  mutation($assignableId: ID!, $actorIds: [ID!]!) {
    replaceActorsForAssignable(input: { assignableId: $assignableId, actorIds: $actorIds }) {
      assignable {
        ... on Issue {
          assignees(first: 20) { nodes { login } }
        }
      }
    }
  }
`;

/**
 * Find the Copilot coding agent actor for a repo, if assignable.
 * @param {Object} github - GitHub API client (must expose .graphql)
 * @param {string} owner
 * @param {string} name
 * @returns {Promise<{id:string, login:string}|null>}
 */
export async function findCopilotActor(github, owner, name) {
  const result = await github.graphql(SUGGESTED_ACTORS_QUERY, { owner, name });
  const nodes = result.repository?.suggestedActors?.nodes || [];
  const copilot = nodes.find((node) => node.login === COPILOT_LOGIN);
  return copilot ? { id: copilot.id, login: copilot.login } : null;
}

/**
 * Assign the Copilot coding agent to the issue in the current context,
 * preserving any existing assignees. Never throws on Copilot unavailability
 * — posts an explanatory comment instead. Only throws on unexpected API
 * errors so the workflow step can surface them.
 * @param {Object} github - GitHub API client
 * @param {Object} context - GitHub Actions context (issues.labeled event)
 * @returns {Promise<{assigned:boolean, reason?:string}>}
 */
export async function assignCopilotToIssue(github, context) {
  const owner = context.repo.owner;
  const name = context.repo.repo;
  const issueNumber = context.issue.number;

  const copilot = await findCopilotActor(github, owner, name);

  if (!copilot) {
    const message =
      '⚠️ Could not assign Copilot: the Copilot coding agent is not available ' +
      'on this repository (not found in `suggestedActors`). Remove and ' +
      're-add the `copilot:fix` label to retry after enabling it.';
    await github.rest.issues.createComment({
      owner,
      repo: name,
      issue_number: issueNumber,
      body: message,
    });
    return { assigned: false, reason: 'copilot-unavailable' };
  }

  const issueResult = await github.graphql(ISSUE_ASSIGNEES_QUERY, {
    owner,
    name,
    number: issueNumber,
  });
  const issue = issueResult.repository?.issue;
  const existingAssigneeIds = (issue?.assignees?.nodes || []).map((n) => n.id);
  const actorIds = Array.from(new Set([...existingAssigneeIds, copilot.id]));

  await github.graphql(REPLACE_ASSIGNEES_MUTATION, {
    assignableId: issue.id,
    actorIds,
  });

  await github.rest.issues.createComment({
    owner,
    repo: name,
    issue_number: issueNumber,
    body:
      '🤖 Assigned the Copilot coding agent to fix this broken link ' +
      '(triggered by the `copilot:fix` label).',
  });

  return { assigned: true };
}
