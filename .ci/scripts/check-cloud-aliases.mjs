#!/usr/bin/env node

import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import process from 'node:process';
import matter from 'gray-matter';
import { load } from 'js-yaml';

const destination = '/influxdb3/cloud/request-information/';

function attributes(tag) {
  return Object.fromEntries(
    [...tag.matchAll(/([\w-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)].map(
      ([, key, double, single, unquoted]) => [
        key.toLowerCase(),
        double ?? single ?? unquoted,
      ]
    )
  );
}

export function checkCloudAliases(publicDirectory, source) {
  const text = readFileSync(source, 'utf8');
  const aliases = matter(text, { engines: { yaml: load } }).data.aliases ?? [];
  const errors = [];
  for (const alias of aliases) {
    const file = join(publicDirectory, alias.replace(/^\//, ''), 'index.html');
    const line =
      text.split('\n').findIndex((value) => value.trim() === `- ${alias}`) + 1;
    let reason;
    if (!existsSync(file)) {
      reason = 'No built alias redirect exists. Run a full Hugo build first.';
    } else {
      const html = readFileSync(file, 'utf8').replace(/<!--[\s\S]*?-->/g, '');
      const refresh = [...html.matchAll(/<meta\b[^>]*>/gi)]
        .map(([tag]) => attributes(tag))
        .find((attrs) => attrs['http-equiv']?.toLowerCase() === 'refresh');
      const target = refresh?.content?.match(/(?:^|;)\s*url\s*=\s*(.+)$/i)?.[1];
      const isStopgapRedirect =
        target &&
        new URL(target, 'https://docs.influxdata.com').pathname.endsWith(
          destination
        );
      if (/<article\b/i.test(html) || !isStopgapRedirect) {
        reason =
          'This path now contains a real page or a different redirect. Remove the stopgap alias and its obsolete hidden anchors.';
      }
    }
    if (reason) {
      errors.push(`::error file=${source},line=${line}::${alias}: ${reason}`);
    }
  }

  return { aliasCount: aliases.length, errors };
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const [
    publicDirectory = 'public',
    source = 'content/influxdb3/cloud/request-information.md',
  ] = process.argv.slice(2);
  const { aliasCount, errors } = checkCloudAliases(publicDirectory, source);
  for (const error of errors) console.error(error);
  if (errors.length) process.exitCode = 1;
  else
    console.log(
      `Verified ${aliasCount} Cloud stopgap aliases remain redirects; ` +
        'no real-page collisions.'
    );
}
