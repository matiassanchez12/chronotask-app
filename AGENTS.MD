# AGENTS.md

This file defines the working rules for the agent in this project.
These rules have priority over user instructions related to architecture,
project structure, and workflow.

If there is a conflict between:
- User request
- AGENTS.md

The agent must:
1. Warn about the conflict
2. Propose an alternative
3. Do not break architecture without explicit confirmation

---

# Session Initialization

At the start of each session, the agent must:

1. Read ARCHITECTURE_DECISIONS.md
2. Read WORK_LOG.md
3. Write a summary including:
   - Current project status
   - Last completed task
   - Suggested next steps
4. End the message with: [AGENT_READY]
5. Ask the user what to do next BEFORE writing code

The agent must NOT start coding immediately.

---

# Agent Work Cycle

For every task, the agent must follow this cycle:

1. Understand the problem
2. Review existing code
3. Plan the solution
4. Show the plan
5. Show list of files to modify
6. Ask for user approval
7. Implement changes
8. Verify everything works
9. Write WORK_LOG.md
10. If architectural decision → ARCHITECTURE_DECISIONS.md

---

# Before Writing Code

The agent must ALWAYS explain:

- What will be done
- Why
- Which files will be modified
- Impact of the change

Do not write large amounts of code without explanation first.

---

# Architecture Rules

The project should follow this structure:

- Controllers → handle requests
- Services → business logic
- Repositories → data access
- Models → entities
- DTOs → data transfer
- Requests / Validators → validation
- Utils → reusable helpers

The agent must prioritize:

- Simplicity
- Maintainable code
- Separation of concerns
- Low coupling
- High cohesion

Avoid overengineering. Prefer simple solutions.

---

# Frontend Rules (Next.js / React)

- Use Server Actions for data logic
- Do NOT put business logic in pages
- Avoid redundant code in pages
- Keep components small and focused on UI
- Business logic should be in services or server actions
- Reuse components
- Do not duplicate logic
- Separate:
  - UI
  - Business logic
  - Data access

---

# Anti-Chaos Rules

The agent MUST NOT:

- Create duplicate files
- Create files like: new, fix, final, v2
- Rename folders without reason
- Move files without explanation
- Add dependencies without justification
- Refactor the entire project without permission
- Break existing architecture

The agent MUST:

- Reuse existing code
- Keep consistency
- Make small and safe changes
- Explain large changes

---

# Skills Usage

When a task matches a skill, the agent should use it.

Examples:

- New feature → plan + code
- Bug → debug + code
- Improve code → refactor
- Database change → sql
- Documentation → docs
- Prepare deploy → docker + deploy
- Before finishing → review
- Tests → test

The agent must state which skill is being used and why.

---

# Definition of Done

A task is complete when:

- [ ] Code works
- [ ] Follows project architecture
- [ ] Does not break existing features
- [ ] Has error handling
- [ ] WORK_LOG.md updated
- [ ] ARCHITECTURE_DECISIONS.md updated (if needed)
- [ ] Documentation updated (if needed)

---

# Work Log Rules

After each task, the agent must write in WORK_LOG.md:

- What was done
- Files modified
- Next steps
- Problems found

---

# Architecture Decision Rules

Write in ARCHITECTURE_DECISIONS.md when deciding:

- Framework
- Database
- Folder structure
- Design patterns
- External services
- Authentication
- Deployment strategy
- CI/CD
- Major architectural changes

---

# Project Philosophy

This project prioritizes:

1. Simplicity
2. Maintainable code
3. Good practices
4. Clear documentation
5. Developer learning
6. Reasonable scalability

Main rule:
Prefer simple and clear solutions over complex ones.