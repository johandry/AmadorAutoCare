import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, extname, join, relative, resolve } from 'node:path';
import { readAndValidateBusinessFacts } from './validate-business-facts.mjs';

const root = process.cwd();
const ignoredDirectories = new Set(['.git', 'node_modules']);

function collectHtmlFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.isDirectory() && !ignoredDirectories.has(entry.name)) {
      return collectHtmlFiles(join(directory, entry.name));
    }

    return entry.isFile() && extname(entry.name) === '.html'
      ? [join(directory, entry.name)]
      : [];
  });
}

const files = collectHtmlFiles(root);
const problems = readAndValidateBusinessFacts(join(root, 'docs/business-facts.json'))
  .map((problem) => `docs/business-facts.json: ${problem}`);
const externalPattern = /^(?:[a-z]+:|\/\/|#)/i;

for (const file of files) {
  const content = readFileSync(file, 'utf8');
  const displayPath = relative(root, file);

  if (!/<title>[^<]+<\/title>/i.test(content)) {
    problems.push(`${displayPath}: missing a non-empty title`);
  }

  if (!/<main\b[^>]*\bid=["']main-content["']/i.test(content)) {
    problems.push(`${displayPath}: missing main-content landmark`);
  }

  const hrefs = content.matchAll(/\bhref=["']([^"']+)["']/gi);
  for (const [, href] of hrefs) {
    if (externalPattern.test(href)) {
      continue;
    }

    const pathWithoutQueryOrFragment = href.split(/[?#]/, 1)[0];
    const target = resolve(dirname(file), pathWithoutQueryOrFragment);
    if (!existsSync(target)) {
      problems.push(`${displayPath}: broken local link ${href}`);
    }
  }
}

if (problems.length > 0) {
  console.error(problems.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Site check passed for ${files.length} HTML pages.`);
}