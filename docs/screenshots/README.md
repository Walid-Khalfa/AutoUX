# 📸 Amazon Q Developer Usage Screenshots

## ⚠️ MANDATORY EVIDENCE
These screenshots demonstrate the **required** usage of Amazon Q Developer in the AutoUX project.

## 📋 Required Screenshots

### 1. amazon-q-chat.png
**What to capture:**
- VS Code with Amazon Q chat panel open
- A conversation showing code review or generation
- Visible AWS Builder ID authentication

**How to create:**
1. Open VS Code with AutoUX project
2. Press Ctrl+Shift+P → "Amazon Q: Open Chat"
3. Ask: "Review the upload route for security issues"
4. Take screenshot showing the full conversation
5. Save as `amazon-q-chat.png`

### 2. amazon-q-suggestions.png
**What to capture:**
- Inline code suggestions from Amazon Q
- Accept/Reject buttons visible
- Code context showing the suggestion

**How to create:**
1. Open `backend/src/routes/upload.js`
2. Start typing a new function
3. Wait for Amazon Q inline suggestion
4. Take screenshot before accepting
5. Save as `amazon-q-suggestions.png`

### 3. amazon-q-security.png
**What to capture:**
- Security scan results from Amazon Q
- List of vulnerabilities (if any)
- Recommended fixes

**How to create:**
1. Right-click on a file in VS Code
2. Select "Amazon Q: Scan for Security Issues"
3. Wait for results
4. Take screenshot of the security report
5. Save as `amazon-q-security.png`

### 4. amazon-q-tests.png
**What to capture:**
- Amazon Q generating test code
- The prompt and the generated test
- File being created/updated

**How to create:**
1. Open Amazon Q chat
2. Ask: "Generate Vitest tests for IssueList component"
3. Show the generated test code
4. Take screenshot
5. Save as `amazon-q-tests.png`

### 5. amazon-q-setup.png
**What to capture:**
- Amazon Q extension installed in VS Code
- AWS Builder ID signed in
- Extension settings visible

**How to create:**
1. Go to VS Code Extensions
2. Show Amazon Q extension installed
3. Click on extension to show details
4. Take screenshot showing authentication status
5. Save as `amazon-q-setup.png`

## 📝 Screenshot Naming Convention

All screenshots must be named exactly as specified above to match the documentation references.

## 🎥 Alternative: Screen Recording

If screenshots are not sufficient, record a 2-3 minute video showing:
1. Opening Amazon Q in VS Code
2. Asking for code review
3. Implementing suggestions
4. Running security scan

Save as: `amazon-q-demo.mp4`

## ⚠️ CRITICAL REMINDER

**Without these screenshots or video evidence, the project will be disqualified.**

The hackathon rules explicitly state:
> "Projects will be automatically disqualified if they don't demonstrate Amazon Q Developer or Kiro usage."

## 📤 Submission Checklist

Before submitting to the hackathon:
- [ ] All 5 screenshots captured and saved
- [ ] Screenshots referenced in AMAZON_Q_INTEGRATION.md
- [ ] README.md updated with Amazon Q section
- [ ] HACKATHON_PITCH.md includes Amazon Q usage
- [ ] Video walkthrough recorded (optional but recommended)
- [ ] Commit history shows Amazon Q assistance

## 🔗 Quick Links

- [Amazon Q Developer](https://aws.amazon.com/q/developer/)
- [AWS Builder ID](https://profile.aws.amazon.com/)
- [VS Code Extension](https://marketplace.visualstudio.com/items?itemName=AmazonWebServices.amazon-q-vscode)
