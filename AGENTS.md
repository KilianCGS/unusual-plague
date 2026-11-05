<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Unusual Plague project instructions

Read `docs/AI_PROJECT_CONTEXT.md` for repository context. Keep shared rules here;
`CLAUDE.md` delegates to this file. Preserve the generated Next.js block above
verbatim; its maintenance note is not authorization to stage or commit.

## Collaboration principle

The AI may implement, inspect, test, refactor within scope, and propose solutions.
The user owns product/design, narrative, visual approval, scope, and destructive
decisions. Prefer understanding and explicit decisions over autonomous scope expansion.

## Git safety

Before substantial work, inspect `git status`. Assume pre-existing working-tree
changes are intentional, user-owned work. Never restore, overwrite, discard, clean,
reset, checkout over, or otherwise destroy unrelated changes. Keep edits scoped
to the current task.

Never run `git add`, `git commit`, `git push`, destructive Git operations, branch
deletion, or history rewriting without explicit user authorization. Authorization
for implementation does NOT imply authorization for stage/commit/push.

## Validation

After implementation, run relevant checks when feasible: project tests relevant
to the change, TypeScript validation, ESLint, and formatting/Prettier where applicable.
Report unavailable or skipped checks. Distinguish automated validation, code
inspection, and manual browser validation. Never claim browser/manual/visual
validation unless actually performed.

## World V2

World V2 is the official/default world implementation. Do not reintroduce a
legacy/V2 switch. For exterior scenes, V2 data/compositions take precedence
according to the current architecture. Do not expand legacy systems unless
explicitly required.

## Manual geometry

Manual geometry is authoritative. Never regenerate, normalize, replace, or
automatically rewrite existing manually authored geometry/colliders to make them
"cleaner". Do not infer coordinates when manual placement is expected. Preserve
existing scene geometry unless the user explicitly requests geometry work.

## Decorator

The Decorator is the preferred authoring tool for visual placement/composition
work. Runtime uses version-controlled exported compositions, not localStorage
drafts. For visual placement tasks, prepare/register assets when appropriate and
let the user perform or approve placement in Decorator unless explicitly asked
otherwise. Do not invent coordinates to complete a task. `flipX` is the canonical
horizontal mirror property; do not introduce a duplicate `mirror` property.

## NPC reuse

Before introducing a new NPC identity, check whether an existing NPC can fulfill
the role through a new pose, location, state, or dialogue. Reusing townspeople
across days is an intentional narrative and production strategy. Do not create
unnecessary near-duplicate NPC identities.

## Assets

Preserve the established visual direction and existing character identities.
Do not regenerate approved assets unless explicitly requested. For transparent
character/interactive assets, do not bake environment/background elements into
the asset unless the pose requires a prop; preserve transparency and current
anchor/scale conventions. Do not place assets at guessed coordinates when manual
Decorator placement is expected.

## Localization

Spanish is the canonical narrative voice. English should be a natural adaptation,
not necessarily a literal word-for-word translation. Gameplay/narrative content
intended for both languages must maintain ES/EN parity unless explicitly scoped
otherwise. Do not silently leave new player-facing narrative text untranslated.

## Narrative implementation

Narrative order should not automatically become systemic gating. Guiding principle:

> The state of the story should change the meaning of things, not necessarily their existence.

Prefer world state, knowledge, dialogue variants, consequences, and contextual
availability over unnecessary rigid quest chains. Do not introduce quest markers,
locks, or forced ordering unless required by the design.

## Scope discipline

Do not expand the ticket because nearby code could be improved. Do not perform
unrelated cleanup during feature work. Report unrelated issues; do not fix them
unless they block the requested work or the user approves.

## Reporting

After substantial implementation, report what changed, important design/architecture
decisions, files modified/created, validation actually performed, unresolved/manual
checks, `git diff --stat`, and `git status`. Keep reports concise unless a detailed
audit is requested.
