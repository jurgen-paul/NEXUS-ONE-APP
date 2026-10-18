# OpenSSF Best Practices & Security Assurance

[![OpenSSF Best Practices](https://www.bestpractices.dev/projects/10423/badge)](https://www.bestpractices.dev/projects/10423)
[![OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/oistars/oistarian-nexus-one/badge)](https://securityscorecards.dev/viewer/?uri=github.com/oistars/oistarian-nexus-one)
[![SLSA Level 3](https://slsa.dev/images/gh-badge-level3.svg)](https://slsa.dev/)
[![ProGuard / R8 Protected](https://img.shields.io/badge/Bytecode-ProGuard%20%2F%20R8%20Hardened-blue?logo=android)](./PROGUARD_DOCUMENTATION.md)
[![Play Store Symbols](https://img.shields.io/badge/Play%20Store-Symbols%20%26%20Deobfuscation-success?logo=googleplay)](./PLAYSTORE_SYMBOLS.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](../LICENSE)

**Oistarian-NEXUS-ONE** adheres to the [Open Source Security Foundation (OpenSSF)](https://openssf.org/) Best Practices criteria and CII (Core Infrastructure Initiative) standards, providing enterprise-grade supply-chain assurance and continuous vulnerability management.

---

## 1. OpenSSF Scorecard & Criteria Alignment

| OpenSSF Criteria | Implementation in NEXUS-ONE | Status |
| :--- | :--- | :--- |
| **Binary Artifacts** | All production builds are compiled deterministically from audited source trees; no untracked binaries in repository. | :white_check_mark: Passing |
| **Branch Protection** | Protected `main` branch with mandatory peer reviews, passing CI matrix, and linear git history. | :white_check_mark: Passing |
| **CI/CD Tests** | Automated linting, TypeScript type-checking, headless unit testing, and hermetic build verification on every commit. | :white_check_mark: Passing |
| **CII Best Practices** | Registered with the OpenSSF Best Practices Program fulfilling Basics, Change Control, Reporting, and Quality metrics. | :white_check_mark: Passing |
| **Code Review** | Mandatory pull request reviews before merges; dual-signature policy for security-sensitive paths. | :white_check_mark: Passing |
| **Dangerous Workflow** | No untrusted code execution or `pull_request_target` exploits in CI/CD pipeline definitions. | :white_check_mark: Passing |
| **Dependency-Update-Tool**| Automated Dependabot / Renovate updates with signed dependency provenance tracking. | :white_check_mark: Passing |
| **Fuzzing & SAST** | Integrated static application security testing (SAST), ESLint security rules, and CodeQL analysis. | :white_check_mark: Passing |
| **Maintained** | Active commit cadence, regular security triage, and quarterly dependency upgrades. | :white_check_mark: Passing |
| **Pinned Dependencies** | All root packages and sub-dependencies strictly locked in `package-lock.json` and container manifests. | :white_check_mark: Passing |
| **Security Policy** | Comprehensive `SECURITY.md` establishing coordinated vulnerability disclosure SLAs and PGP keys. | :white_check_mark: Passing |
| **Signed Releases** | Cryptographic release signing via Sigstore / Cosign with verifiable SLSA Level 3 attestations. | :white_check_mark: Passing |
| **Token Permissions** | GitHub Actions workflows run with read-only default token permissions (`contents: read`). | :white_check_mark: Passing |
| **Vulnerabilities** | Zero unpatched High or Critical CVEs tracked via automated vulnerability database scanning. | :white_check_mark: Passing |

---

## 2. Supply Chain Integrity & SLSA Level 3

NEXUS-ONE enforces the **Supply-chain Levels for Software Artifacts (SLSA)** framework:

```
[ Developer Commit ] 
       │ (Signed GPG/SSH)
       ▼
[ Protected CI/CD Runner ] ──► [ Isolated Hermetic Build ]
       │
       ▼
[ SLSA Provenance Attestation (Cosign / Sigstore) ]
       │
       ▼
[ Container & Release Registry ] ──► [ Client / Enterprise Deployment ]
```

1. **Hermetic Builds**: Build pipelines execute in isolated ephemeral containers without arbitrary external network downloads.
2. **Cryptographic Provenance**: Every release bundle includes an in-toto attestation signed with ephemeral OIDC keys via Sigstore.
3. **Software Bill of Materials (SBOM)**: Every release generates standard SPDX 2.3 and CycloneDX 1.5 JSON SBOM manifests detailing all transitive dependencies, licenses, and cryptographic hashes.

---

## 3. Vulnerability Management & Disclosure Protocol

- **Coordinated Disclosure**: Security vulnerabilities must be reported through our encrypted channels outlined in [SECURITY.md](../SECURITY.md) or via GitHub Private Vulnerability Reporting.
- **Triage SLA**: Initial response within **24 hours**; vulnerability validation within **72 hours**; patch deployment within **7 calendar days** for Critical severity issues.
- **Public Advisory (GHSA)**: CVE assignment and detailed mitigation advisories published upon release of remediation builds.

---

## 4. Secret Management & Memory Safety

- **No Secrets in Source**: Hardcoded secrets, API tokens, and credentials are strictly prohibited and enforced via pre-commit hooks and Secretlint.
- **Server-Side Proxy Architecture**: External AI and cloud tokens (`GEMINI_API_KEY`, GCP service account keys) reside exclusively server-side in memory or secure cloud vaults (`Secret Manager`), never leaked to the client bundle.
- **Memory Safety**: Core application logic runs on modern TypeScript and V8/Node.js runtimes with automated garbage collection and bounds checking.
