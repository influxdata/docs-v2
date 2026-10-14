const toolDirectivePrefixes = [
  /eslint(?:-disable|-enable)?(?:-next-line|-line)?\b/,
  /globals?\s/,
  /exported\s/,
  /@ts-(?:expect-error|ignore|nocheck|check)\b/,
  /prettier-ignore\b/,
  /(?:c8|v8|istanbul) ignore\b/,
  /webpack[A-Z]\w*:/,
  /[@#]__PURE__\b/,
];
const toolDirective = new RegExp(
  `^(?:${toolDirectivePrefixes.map((prefix) => prefix.source).join('|')})`
);
const tripleSlashDirective = /^\/\s*<reference\s/;
const licenseNotice = /copyright|SPDX-License-Identifier/i;
const whyTag = /^\*?\s*WHY:/;

function commentText(comment) {
  return comment.value.trim();
}

function isToolDirective(comment) {
  const text = commentText(comment);
  return (
    comment.type === 'Shebang' ||
    toolDirective.test(text) ||
    (comment.type === 'Line' && tripleSlashDirective.test(comment.value))
  );
}

function isLeadingLicense(comment, sourceCode) {
  const firstToken = sourceCode.ast.tokens[0];
  const leading = !firstToken || comment.range[1] <= firstToken.range[0];
  return leading && licenseNotice.test(comment.value);
}

function isJsDoc(comment) {
  return comment.type === 'Block' && comment.value.startsWith('*');
}

function declaredNames(statement) {
  if (statement.type === 'VariableDeclaration') {
    return statement.declarations
      .filter((declarator) => declarator.id.type === 'Identifier')
      .map((declarator) => declarator.id.name);
  }
  return statement.id?.name ? [statement.id.name] : [];
}

function exportedLocalNames(program) {
  return program.body.flatMap((statement) => {
    if (statement.type === 'ExportNamedDeclaration' && !statement.source) {
      return statement.specifiers.map((specifier) => specifier.local.name);
    }
    if (
      statement.type === 'ExportDefaultDeclaration' &&
      statement.declaration.type === 'Identifier'
    ) {
      return [statement.declaration.name];
    }
    return [];
  });
}

function exportDocumentedStatements(program) {
  const exportedNames = new Set(exportedLocalNames(program));
  return program.body.filter(
    (statement) =>
      statement.type === 'ExportNamedDeclaration' ||
      statement.type === 'ExportDefaultDeclaration' ||
      declaredNames(statement).some((name) => exportedNames.has(name))
  );
}

function exportJsDocComments(sourceCode) {
  return new Set(
    exportDocumentedStatements(sourceCode.ast)
      .map((statement) => sourceCode.getCommentsBefore(statement).at(-1))
      .filter((comment) => comment && isJsDoc(comment))
  );
}

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Disallow comments except tool directives, license headers, JSDoc on exports, and WHY: notes',
    },
    schema: [],
    messages: {
      removeComment:
        'Remove this comment. Rename or extract the code it explains, or start it with WHY: if it records a constraint the code cannot show.',
    },
  },
  create(context) {
    const { sourceCode } = context;
    return {
      'Program:exit'() {
        const exportJsDoc = exportJsDocComments(sourceCode);
        sourceCode
          .getAllComments()
          .filter(
            (comment) =>
              !isToolDirective(comment) &&
              !isLeadingLicense(comment, sourceCode) &&
              !exportJsDoc.has(comment) &&
              !whyTag.test(commentText(comment))
          )
          .forEach((comment) =>
            context.report({ loc: comment.loc, messageId: 'removeComment' })
          );
      },
    };
  },
};
