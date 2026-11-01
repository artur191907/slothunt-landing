#!/usr/bin/env bash
# SessionStart hook: install gstack (https://github.com/garrytan/gstack) in
# Claude Code cloud sessions, whose containers start without ~/.claude/skills.
# Local machines are left alone: developers install gstack themselves (see CLAUDE.md).
# Never fails the session: any error is logged to stderr and the hook exits 0.

[ "${CLAUDE_CODE_REMOTE:-}" = "true" ] || exit 0

GSTACK_DIR="$HOME/.claude/skills/gstack"
[ -d "$GSTACK_DIR/bin" ] && exit 0   # already installed; gstack's own hook handles updates

{
  mkdir -p "$HOME/.claude/skills" &&
  git clone --single-branch --depth 1 https://github.com/garrytan/gstack.git "$GSTACK_DIR" &&
  cd "$GSTACK_DIR" &&
  ./setup --team --quiet --no-browser --no-plan-tune-hooks < /dev/null
} >&2 || {
  echo "gstack install failed; skills like /qa and /review are unavailable this session." >&2
  # Remove a partial clone so the next session retries cleanly.
  [ -d "$GSTACK_DIR/bin" ] || rm -rf "$GSTACK_DIR"
}
exit 0
