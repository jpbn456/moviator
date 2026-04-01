# Skill Registry

**Last Updated**: 2026-04-01
**Mode**: openspec

## User-Level Skills

### Core SDD Skills (opencode)
| Skill | Path | Description |
|-------|------|-------------|
| sdd-init | `/home/juan/.config/opencode/skills/sdd-init/SKILL.md` | Initialize SDD context in any project |
| sdd-explore | `/home/juan/.config/opencode/skills/sdd-explore/SKILL.md` | Explore and investigate ideas before committing to a change |
| sdd-propose | `/home/juan/.config/opencode/skills/sdd-propose/SKILL.md` | Create a change proposal with intent, scope, and approach |
| sdd-spec | `/home/juan/.config/opencode/skills/sdd-spec/SKILL.md` | Write specifications with requirements and scenarios |
| sdd-design | `/home/juan/.config/opencode/skills/sdd-design/SKILL.md` | Create technical design document |
| sdd-tasks | `/home/juan/.config/opencode/skills/sdd-tasks/SKILL.md` | Break down a change into implementation task checklist |
| sdd-apply | `/home/juan/.config/opencode/skills/sdd-apply/SKILL.md` | Implement tasks from the change |
| sdd-verify | `/home/juan/.config/opencode/skills/sdd-verify/SKILL.md` | Validate implementation against specs |
| sdd-archive | `/home/juan/.config/opencode/skills/sdd-archive/SKILL.md` | Sync delta specs and archive completed change |
| branch-pr | `/home/juan/.config/opencode/skills/branch-pr/SKILL.md` | PR creation workflow for Agent Teams Lite |
| issue-creation | `/home/juan/.config/opencode/skills/issue-creation/SKILL.md` | Issue creation workflow |
| go-testing | `/home/juan/.config/opencode/skills/go-testing/SKILL.md` | Go testing patterns |
| skill-creator | `/home/juan/.config/opencode/skills/skill-creator/SKILL.md` | Create new AI agent skills |

### GSAP Skills (opencode)
| Skill | Path | Description |
|-------|------|-------------|
| gsap-core | `/home/juan/.config/opencode/skills/gsap-core/SKILL.md` | Core GSAP API (to, from, fromTo, easing) |
| gsap-react | `/home/juan/.config/opencode/skills/gsap-react/SKILL.md` | GSAP for React (useGSAP, refs, cleanup) |
| gsap-frameworks | `/home/juan/.config/opencode/skills/gsap-frameworks/SKILL.md` | GSAP for Vue, Svelte, non-React frameworks |
| gsap-timeline | `/home/juan/.config/opencode/skills/gsap-timeline/SKILL.md` | GSAP timelines (sequencing, nesting) |
| gsap-scrolltrigger | `/home/juan/.config/opencode/skills/gsap-scrolltrigger/SKILL.md` | ScrollTrigger (scroll-linked animations) |
| gsap-plugins | `/home/juan/.config/opencode/skills/gsap-plugins/SKILL.md` | GSAP plugins (ScrollTo, Flip, Draggable, etc.) |
| gsap-performance | `/home/juan/.config/opencode/skills/gsap-performance/SKILL.md` | GSAP performance optimization |
| gsap-utils | `/home/juan/.config/opencode/skills/gsap-utils/SKILL.md` | GSAP utilities (clamp, mapRange, random, etc.) |

### User-Level Override Skills (claude)
| Skill | Path | Description |
|-------|------|-------------|
| sdd-init | `/home/juan/.claude/skills/sdd-init/SKILL.md` | Override: sdd-init |
| sdd-explore | `/home/juan/.claude/skills/sdd-explore/SKILL.md` | Override: sdd-explore |
| sdd-propose | `/home/juan/.claude/skills/sdd-propose/SKILL.md` | Override: sdd-propose |
| sdd-spec | `/home/juan/.claude/skills/sdd-spec/SKILL.md` | Override: sdd-spec |
| sdd-design | `/home/juan/.claude/skills/sdd-design/SKILL.md` | Override: sdd-design |
| sdd-tasks | `/home/juan/.claude/skills/sdd-tasks/SKILL.md` | Override: sdd-tasks |
| sdd-apply | `/home/juan/.claude/skills/sdd-apply/SKILL.md` | Override: sdd-apply |
| sdd-verify | `/home/juan/.claude/skills/sdd-verify/SKILL.md` | Override: sdd-verify |
| sdd-archive | `/home/juan/.claude/skills/sdd-archive/SKILL.md` | Override: sdd-archive |
| go-testing | `/home/juan/.claude/skills/go-testing/SKILL.md` | Override: go-testing |
| judgment-day | `/home/juan/.claude/skills/judgment-day/SKILL.md` | Adversarial review protocol |
| branch-pr | `/home/juan/.claude/skills/branch-pr/SKILL.md` | Override: branch-pr |
| issue-creation | `/home/juan/.claude/skills/issue-creation/SKILL.md` | Override: issue-creation |
| skill-creator | `/home/juan/.claude/skills/skill-creator/SKILL.md` | Override: skill-creator |

### Shared Reference Skills (claude)
| Skill | Path | Description |
|-------|------|-------------|
| persistence-contract | `/home/juan/.claude/skills/_shared/persistence-contract.md` | SDD persistence conventions |
| engram-convention | `/home/juan/.claude/skills/_shared/engram-convention.md` | Engram artifact naming and recovery |
| openspec-convention | `/home/juan/.claude/skills/_shared/openspec-convention.md` | Openspec file structure |
| sdd-phase-common | `/home/juan/.claude/skills/_shared/sdd-phase-common.md` | Common phase utilities |
| skill-resolver | `/home/juan/.claude/skills/_shared/skill-resolver.md` | Skill resolution logic |

## Project-Level Skills

No project-level skills detected (empty project).

## Project Conventions

No project conventions detected (empty project).

## Resolution Priority

1. Project-level skills (highest priority)
2. User-level override skills (`~/.claude/skills/`)
3. User-level default skills (`~/.config/opencode/skills/`)

## Notes

- This is a greenfield project with no existing code
- Skill resolution will use defaults from opencode with overrides from claude
- Project-level skills can be added in `.claude/skills/` or `.agent/skills/`