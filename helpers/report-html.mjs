// Renders an exploratory testing report folder to one self-contained report.html.
// Usage: node helpers/report-html.mjs tests/exploratory/reports/TS-2/v0.1
//
// Reads report.md and, when present: scenarios.feature (Gherkin shown under each scenario row),
// qa-review.md (the QA engineer's answers and decisions, shown as extra columns), and the
// appendix files locators.md, technical.md and ledger.md (collapsed at the end).
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { marked } from 'marked';

// Raw HTML in the markdown is shown as text, never rendered: placeholders like "<field>" stay
// visible, and text quoted from the application cannot inject markup into the report.
marked.use({ renderer: { html: ({ text }) => escape(text) } });

const dir = process.argv[2];
if (!dir || !existsSync(join(dir, 'report.md'))) {
  console.error('Usage: node helpers/report-html.mjs <report folder containing report.md>');
  process.exit(1);
}

const read = (file) => (existsSync(join(dir, file)) ? readFileSync(join(dir, file), 'utf8') : '');
const escape = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Cell values that become coloured badges. Matched against the whole cell text, case-insensitively.
const BADGES = {
  observed: 'tag-observed',
  inferred: 'tag-inferred',
  assumed: 'tag-assumed',
  met: 'ok',
  partly: 'warn',
  'not met': 'bad',
  'not explored': 'muted',
  'automate now': 'dec-now',
  'clarify first': 'dec-clarify',
  'keep exploratory': 'dec-explore',
  'not worth automating': 'dec-no',
  high: 'bad',
  medium: 'warn',
  low: 'ok',
  defect: 'bad',
  risk: 'warn',
  gap: 'muted',
  functional: 'type-func',
  regression: 'type-reg',
  stable: 'st-stable',
  'at risk': 'st-risk',
  blocked: 'st-blocked',
  new: 'muted',
  carried: 'muted',
  resolved: 'ok',
  a: 'grade-a',
  b: 'grade-b',
  c: 'grade-c',
  d: 'grade-d',
};

const badgeCells = (html) =>
  html.replace(/<td>([^<]*)<\/td>/g, (cell, text) => {
    // "at risk (C)" and "Observed" both match on the text before any parenthesis.
    const cls =
      BADGES[
        text
          .trim()
          .toLowerCase()
          .replace(/\s*\(.*\)$/, '')
      ];
    return cls ? `<td><span class="badge ${cls}">${text.trim()}</span></td>` : cell;
  });

// --- Gherkin: one block per scenario ID, from scenarios.feature ---------------------------------
const gherkin = {};
{
  const blocks = read('scenarios.feature').split(/\n(?=\s*(?:@[\w-]+\s*\n\s*)*Scenario(?: Outline)?:)/);
  for (const block of blocks) {
    const id = block.match(/Scenario(?: Outline)?:\s*(S-[\w-]+)/)?.[1];
    if (id) gherkin[id] = block.replace(/^\n+|\s+$/g, '');
  }
}

// --- QA review: answers (Q-nn) and decisions (S-nn), from qa-review.md --------------------------
const qa = { answer: {}, decision: {}, note: {} };
for (const line of read('qa-review.md').split('\n')) {
  const cells = line.split('|').map((c) => c.trim());
  if (cells.length < 3 || !cells[1]) continue;
  const id = cells[1];
  // The answer is the last column, with or without a Question column before it.
  if (/^Q-/.test(id)) qa.answer[id] = cells[cells.length - 2] ?? '';
  if (/^S-/.test(id)) {
    qa.decision[id] = cells[4] ?? '';
    qa.note[id] = cells[5] ?? '';
  }
}

// Append a column to every table whose rows start with the given ID prefix.
const addColumn = (html, prefix, label, value) =>
  html.replace(/<table>[\s\S]*?<\/table>/g, (table) => {
    if (!new RegExp(`<tr>\\s*<td>${prefix}-`).test(table)) return table;
    return table
      .replace(/(<thead>\s*<tr>[\s\S]*?)(<\/tr>)/, `$1<th>${label}</th>$2`)
      .replace(/<tr>\s*<td>(\S+)<\/td>([\s\S]*?)<\/tr>/g, (row, id, rest) => {
        const v = value(id);
        const cell = v ? `<td class="qa">${escape(v)}</td>` : '<td class="qa empty">—</td>';
        return `<tr><td>${id}</td>${rest}${cell}</tr>`;
      });
  });

// Scenario rows: the title becomes a disclosure that shows the Gherkin.
const expandScenarios = (html) =>
  html.replace(/<tr>\s*<td>(S-[\w-]+)<\/td>\s*<td>([^<]*)<\/td>/g, (row, id, title) =>
    gherkin[id]
      ? `<tr><td>${id}</td><td><details class="scenario"><summary>${title}</summary><pre class="gherkin">${escape(gherkin[id])}</pre></details></td>`
      : row,
  );

// Evidence IDs become links to their files: "E-12" in this version, "v0.1/E-12" in an earlier one.
// After sign-off the drafts are gone and their cited evidence sits here as "v0.1_E-12.<ext>".
const evidenceIndex = {};
const filesIn = (folder) =>
  (evidenceIndex[folder] ??= existsSync(folder)
    ? Object.fromEntries(readdirSync(folder).map((f) => [f.match(/^(v\d+\.\d+_)?E-\d+/)?.[0], f]))
    : {});
const evidenceFile = (version, id) => {
  if (!version) return filesIn(join(dir, 'evidence'))[id] && `evidence/${filesIn(join(dir, 'evidence'))[id]}`;
  const draft = filesIn(join(dir, '..', version, 'evidence'))[id];
  if (draft) return `../${version}/evidence/${draft}`;
  const copied = filesIn(join(dir, 'evidence'))[`${version}_${id}`];
  return copied && `evidence/${copied}`;
};
const linkEvidence = (html) =>
  html.replace(/(<a\b[\s\S]*?<\/a>|<[^>]+>)|\b(?:(v\d+\.\d+)\/)?(E-\d{2,})\b/g, (match, tag, version, id) => {
    if (tag) return tag;
    const href = evidenceFile(version, id);
    return href ? `<a class="ev" href="${encodeURI(href)}">${match}</a>` : match;
  });

const render = (markdown) => linkEvidence(badgeCells(marked.parse(markdown, { gfm: true })));

// Split the rendered report at each h2 so every section can be collapsed, and build a nav.
const sections = (html) => {
  const nav = [];
  const body = html
    .split(/(?=<h2)/)
    .map((part, i) => {
      const heading = part.match(/<h2[^>]*>(.*?)<\/h2>/);
      if (!heading) return part;
      const id = `s${i}`;
      nav.push(`<a href="#${id}">${heading[1].replace(/^\d+\.\s*/, '')}</a>`);
      const content = part.replace(heading[0], '');
      return `<details open id="${id}"><summary>${heading[1]}</summary>${content}</details>`;
    })
    .join('');
  return { nav: nav.join(''), body };
};

const report = read('report.md');
const title = report.match(/^#\s+(.*)$/m)?.[1] ?? 'Automation-readiness report';

// The header table (first table in the report) becomes a strip of key facts.
const header = {};
for (const line of report.split('\n').slice(0, 20)) {
  const m = line.match(/^\|\s*([^|]+?)\s*\|\s*(.+?)\s*\|$/);
  if (m && m[1] !== '---') header[m[1]] = m[2];
}
const signed = /signed off/i.test(header.Status ?? '') && !/not signed/i.test(header.Status ?? '');
// Two columns of label/value rows. A value split by ";" is shown line by line.
const factRow = (key) => {
  const lines = (header[key] ?? '')
    .split(/;\s*/)
    .map((line) =>
      render(line)
        .replace(/<\/?p>/g, '')
        .trim(),
    )
    .filter(Boolean);
  return header[key] ? `<div class="fact"><span>${key}</span><div>${lines.join('<br>')}</div></div>` : '';
};
const facts =
  `<div class="facts-col">${['Version', 'Environment', 'Run'].map(factRow).join('')}</div>` +
  `<div class="facts-col">${['Budget', 'Story source', 'Inputs'].map(factRow).join('')}</div>`;

let body = render(report.replace(/^#\s+.*$/m, '').replace(/^\|[\s\S]*?\n\n/m, ''));
body = addColumn(body, 'Q', 'Answer (QA)', (id) => qa.answer[id]);
body = addColumn(body, 'S', 'QA decision', (id) => [qa.decision[id], qa.note[id]].filter(Boolean).join(' — '));
body = expandScenarios(body);
const main = sections(body);

// Jira comment from qa-review.md: the text the next run posts, and whether the QA engineer ticked it.
const jiraComment = (() => {
  const section = read('qa-review.md').match(/## Jira comment\s*\n([\s\S]*?)(?=\n## |\s*$)/)?.[1];
  if (!section) return '';
  const text = section.match(/```text\n([\s\S]*?)```/)?.[1]?.trim() ?? '';
  const ticked = /- \[x\]\s*Post this comment/i.test(section);
  const posted = section.match(/^- Posted:\s*(.+)$/m)?.[1]?.trim() ?? 'no';
  // Posted only when the line starts with a date or carries a link; "no (...)" notes are not posted.
  const isPosted = /^\d{4}-\d{2}-\d{2}/.test(posted) || /https?:\/\//.test(posted);
  const status = isPosted
    ? `<span class="badge ok">Posted: ${escape(posted)}</span>`
    : ticked
      ? '<span class="badge dec-now">Will be posted in the next run</span>'
      : '<span class="badge muted">Not approved: tick the box in qa-review.md to post it</span>';
  return `<details open id="jira"><summary>Jira comment</summary><p>${status}</p><p>Edit the text and tick the box in <code>qa-review.md</code>. It is posted exactly as written.</p><pre class="comment">${escape(text)}</pre></details>`;
})();

const appendix = (file, label) => {
  const text = read(file);
  if (!text) return '';
  const html = file.endsWith('.md') ? render(text) : `<pre class="gherkin">${escape(text)}</pre>`;
  return `<details class="appendix"><summary>Appendix: ${label} <code>${file}</code></summary>${html}</details>`;
};

const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escape(title)}</title>
<style>
  :root { --ink: #1f2933; --muted: #6b7280; --line: #e5e7eb; --bg: #f6f7f9; --card: #fff; --accent: #4f46e5; }
  * { box-sizing: border-box; }
  body { margin: 0; font: 15px/1.5 system-ui, -apple-system, "Segoe UI", sans-serif; color: var(--ink); background: var(--bg); }
  header { background: var(--card); border-bottom: 1px solid var(--line); padding: 20px 32px; }
  header h1 { margin: 0 0 12px; font-size: 22px; }
  .status { display: inline-block; margin-left: 12px; padding: 2px 10px; border-radius: 999px; font-size: 13px; font-weight: 600; vertical-align: middle; }
  .status.draft { background: #fef3c7; color: #92400e; }
  .status.signed { background: #d1fae5; color: #065f46; }
  .facts { display: grid; grid-template-columns: 1fr 1fr; gap: 0 40px; font-size: 14px; }
  .fact { display: grid; grid-template-columns: 120px 1fr; gap: 12px; padding: 6px 0; border-top: 1px solid var(--line); }
  .fact span { color: var(--muted); font-size: 12px; text-transform: uppercase; letter-spacing: .04em; padding-top: 2px; }
  @media (max-width: 900px) { .facts { grid-template-columns: 1fr; } }
  nav { position: sticky; top: 0; z-index: 1; background: var(--card); border-bottom: 1px solid var(--line); padding: 8px 32px; display: flex; flex-wrap: wrap; gap: 4px 16px; font-size: 14px; }
  nav a { color: var(--accent); text-decoration: none; }
  main { max-width: 1400px; margin: 0 auto; padding: 24px 32px 64px; }
  details { background: var(--card); border: 1px solid var(--line); border-radius: 8px; margin: 0 0 16px; padding: 0 20px 4px; }
  summary { cursor: pointer; font-size: 18px; font-weight: 600; padding: 14px 0; list-style: none; }
  summary::before { content: "▸ "; color: var(--muted); font-size: 14px; }
  details[open] > summary::before { content: "▾ "; }
  details.appendix summary { font-size: 15px; color: var(--muted); }
  details.scenario { border: 0; margin: 0; padding: 0; background: none; }
  details.scenario summary { font-size: 14px; font-weight: 500; padding: 0; color: var(--accent); }
  details.scenario pre { margin: 8px 0 4px; }
  h3 { font-size: 15px; margin: 20px 0 8px; }
  blockquote { margin: 12px 0; padding: 10px 16px; border-left: 4px solid var(--accent); background: #eef2ff; border-radius: 0 6px 6px 0; }
  blockquote p { margin: 4px 0; }
  table { border-collapse: collapse; width: 100%; margin: 8px 0 16px; font-size: 14px; }
  th, td { border: 1px solid var(--line); padding: 6px 10px; text-align: left; vertical-align: top; }
  th { background: #f3f4f6; font-weight: 600; white-space: nowrap; }
  tr:nth-child(even) td { background: #fafafa; }
  td.qa { background: #fffbeb !important; }
  td.qa.empty { color: var(--muted); text-align: center; }
  code { font: 13px/1.4 ui-monospace, Consolas, monospace; background: #f3f4f6; padding: 1px 4px; border-radius: 3px; }
  pre { background: #1f2933; color: #e5e7eb; padding: 14px; border-radius: 6px; overflow: auto; font-size: 13px; }
  pre code { background: none; color: inherit; padding: 0; }
  pre.comment { background: #f9fafb; color: var(--ink); border: 1px solid var(--line); white-space: pre-wrap; font: 14px/1.5 system-ui, sans-serif; }
  .badge { display: inline-block; padding: 1px 8px; border-radius: 999px; font-size: 12px; font-weight: 600; white-space: nowrap; }
  .tag-observed { background: #d1fae5; color: #065f46; }
  .tag-inferred { background: #dbeafe; color: #1e40af; }
  .tag-assumed { background: #fef3c7; color: #92400e; }
  .ok, .dec-now, .grade-a { background: #d1fae5; color: #065f46; }
  .warn, .dec-clarify, .grade-c { background: #fef3c7; color: #92400e; }
  .bad, .grade-d { background: #fee2e2; color: #991b1b; }
  .muted, .dec-no { background: #e5e7eb; color: #374151; }
  .dec-explore, .grade-b { background: #dbeafe; color: #1e40af; }
  .type-func { background: #ede9fe; color: #5b21b6; }
  .type-reg { background: #ffedd5; color: #9a3412; }
  .st-stable, .st-risk, .st-blocked { background: none; padding-left: 0; font-weight: 500; }
  .st-stable::before { content: "✅ "; }
  .st-risk::before { content: "⚠️ "; }
  .st-blocked::before { content: "⛔ "; }
  @media (max-width: 700px) { header, nav, main { padding-left: 16px; padding-right: 16px; } table { display: block; overflow-x: auto; } }
  @media print { nav { display: none; } details { break-inside: avoid; } }
</style>
</head>
<body>
<header>
  <h1>${escape(title)}<span class="status ${signed ? 'signed' : 'draft'}">${signed ? 'Signed off' : 'Draft'}</span></h1>
  <div class="facts">${facts}</div>
</header>
<nav>${main.nav}${jiraComment ? '<a href="#jira">Jira comment</a>' : ''}</nav>
<main>
${main.body}
${jiraComment}
${appendix('qa-review.md', 'QA review (your answers, decisions and Jira comment)')}
${appendix('locators.md', 'Full locator table')}
${appendix('technical.md', 'Console, network and accessibility')}
${appendix('ledger.md', 'Ledger')}
</main>
</body>
</html>
`;

const out = join(dir, 'report.html');
writeFileSync(out, page);
console.log(`Written ${resolve(out)}`);
