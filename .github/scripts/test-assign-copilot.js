/**
 * Test Suite for assign-copilot.js
 * Run with: node .github/scripts/test-assign-copilot.js
 */

import {
  COPILOT_LOGIN,
  findCopilotActor,
  assignCopilotToIssue,
} from './assign-copilot.js';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function test(name, fn) {
  totalTests++;
  return Promise.resolve()
    .then(fn)
    .then(() => {
      passedTests++;
      console.log(`✓ ${name}`);
    })
    .catch((error) => {
      failedTests++;
      console.error(`✗ ${name}`);
      console.error(`  ${error.message}`);
    });
}

function assertEquals(actual, expected, message = '') {
  const actualStr = JSON.stringify(actual);
  const expectedStr = JSON.stringify(expected);
  if (actualStr !== expectedStr) {
    throw new Error(
      `${message}\n  Expected: ${expectedStr}\n  Actual: ${actualStr}`
    );
  }
}

const context = {
  repo: { owner: 'influxdata', repo: 'docs-v2' },
  issue: { number: 55 },
};

async function run() {
  console.log('\n=== Testing assign-copilot.js ===\n');

  await test('findCopilotActor: finds the coding agent by login', async () => {
    const github = {
      graphql: async () => ({
        repository: {
          suggestedActors: {
            nodes: [
              { login: 'some-user', __typename: 'User', id: 'U_1' },
              { login: COPILOT_LOGIN, __typename: 'Bot', id: 'BOT_1' },
            ],
          },
        },
      }),
    };
    const actor = await findCopilotActor(github, 'influxdata', 'docs-v2');
    assertEquals(actor, { id: 'BOT_1', login: COPILOT_LOGIN });
  });

  await test('findCopilotActor: returns null when not suggested', async () => {
    const github = {
      graphql: async () => ({
        repository: { suggestedActors: { nodes: [] } },
      }),
    };
    const actor = await findCopilotActor(github, 'influxdata', 'docs-v2');
    assertEquals(actor, null);
  });

  await test('assignCopilotToIssue: assigns and comments on success', async () => {
    const calls = [];
    const github = {
      graphql: async (query, vars) => {
        if (query.includes('suggestedActors')) {
          return {
            repository: {
              suggestedActors: {
                nodes: [
                  { login: COPILOT_LOGIN, __typename: 'Bot', id: 'BOT_1' },
                ],
              },
            },
          };
        }
        if (
          query.includes('assignees(first: 20)') &&
          query.includes('issue(number')
        ) {
          return {
            repository: {
              issue: {
                id: 'ISSUE_1',
                assignees: { nodes: [{ id: 'U_EXISTING', login: 'someone' }] },
              },
            },
          };
        }
        if (query.includes('replaceActorsForAssignable')) {
          calls.push(vars);
          return {
            replaceActorsForAssignable: {
              assignable: { assignees: { nodes: [{ login: COPILOT_LOGIN }] } },
            },
          };
        }
        throw new Error(`Unexpected query: ${query}`);
      },
      rest: {
        issues: {
          createComment: async (params) => {
            calls.push({ comment: params.body });
          },
        },
      },
    };

    const result = await assignCopilotToIssue(github, context);
    assertEquals(result, { assigned: true });
    assertEquals(calls[0].assignableId, 'ISSUE_1');
    assertEquals(calls[0].actorIds.sort(), ['BOT_1', 'U_EXISTING'].sort());
    assertEquals(
      calls[1].comment.includes('Assigned the Copilot coding agent'),
      true
    );
  });

  await test('assignCopilotToIssue: graceful comment when Copilot unavailable', async () => {
    const comments = [];
    const github = {
      graphql: async () => ({
        repository: { suggestedActors: { nodes: [] } },
      }),
      rest: {
        issues: {
          createComment: async (params) => comments.push(params.body),
        },
      },
    };

    const result = await assignCopilotToIssue(github, context);
    assertEquals(result, { assigned: false, reason: 'copilot-unavailable' });
    assertEquals(comments.length, 1);
    assertEquals(comments[0].includes('not available'), true);
  });

  console.log('\n=== Test Summary ===');
  console.log(`Total: ${totalTests}`);
  console.log(`Passed: ${passedTests}`);
  console.log(`Failed: ${failedTests}`);

  if (failedTests > 0) {
    process.exit(1);
  }
}

run();
