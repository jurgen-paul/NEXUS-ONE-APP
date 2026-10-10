# Security Policy & OpenSSF Compliance

[![OpenSSF Best Practices](https://www.bestpractices.dev/projects/10423/badge)](https://www.bestpractices.dev/projects/10423)
[![OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/oistars/oistarian-nexus-one/badge)](https://securityscorecards.dev/viewer/?uri=github.com/oistars/oistarian-nexus-one)

The **Oistarian-NEXUS-ONE** project maintains a rigorous, multi-layered security posture adhering to the [Open Source Security Foundation (OpenSSF)](https://openssf.org/) Best Practices criteria and CII standards.

---

## 1. Supported Versions

Security patches and emergency hotfixes are provided for the following releases:

| Version | Supported          | Release Notes / Status |
| :---    | :---:              | :--- |
| **5.1.x** | :white_check_mark: | Current Active Release (LTS) |
| **5.0.x** | :white_check_mark: | Maintenance Mode (Security Patches Only) |
| **4.0.x** | :white_check_mark: | Critical CVE Backports Only |
| **< 4.0** | :x:                | End of Life (Unsupported) |

---

## 2. Reporting a Vulnerability

We operate a strict **Coordinated Vulnerability Disclosure (CVD)** process. We kindly request that security researchers and community members refrain from public disclosure until an official patch has been deployed.

### Contact Channels:
- **Primary Security Email**: `oistarsentertainment@gmail.com`
- **Subject Line**: `[SECURITY VULNERABILITY] NEXUS-ONE - <Brief Component Description>`
- **GitHub Advisory**: You may also submit confidential reports via the **Security** > **Report a vulnerability** tab on the repository.

### Information to Include in Your Report:
1. Affected module or endpoint (e.g., `AIEngine`, `GoogleSheetsHub`, `WebSpeechVoiceBridge`, `server.ts`).
2. Severity assessment (CVSS v3.1 vector or rationale).
3. Step-by-step reproduction instructions or a minimal Proof of Concept (PoC).
4. Potential business or operational impact (e.g., credential disclosure, SSRF, memory leak).

---

## 3. Vulnerability Response SLA & Timeline

Our security team adheres to the following response timeline:

| Milestone | Target SLA | Description |
| :--- | :--- | :--- |
| **Initial Acknowledgment** | **< 24 Hours** | Confirmation of receipt with an assigned incident tracking ID. |
| **Triage & Validation** | **< 72 Hours** | Engineering team reproduces the vulnerability and determines scope. |
| **Remediation & Patch** | **< 7 Days** (Critical)<br>**< 14 Days** (High) | Patch development, peer review, and automated regression testing. |
| **Advisory & Release** | **Immediate upon patch** | Release of fixed version, CVE assignment, and public acknowledgment. |

---

## 4. Supply Chain & Code Integrity Standards

NEXUS-ONE implements continuous automated supply chain defenses:
- **SLSA Level 3 Alignment**: Hermetic builds, isolated runner environments, and cryptographic commit signing.
- **SBOM Delivery**: Software Bill of Materials in SPDX and CycloneDX formats generated for every release.
- **Automated Scanning**: Nightly CodeQL, Dependabot dependency alert audits, and secret scanning with zero tolerance for leaked keys.
- **ProGuard / R8 Hardening**: Native binary symbol deobfuscation and bytecode obfuscation enabled across mobile and client runtime bundles.
- **Zero Client Secret Exposure**: Cloud tokens and Gemini API keys are proxied exclusively through server-side authenticated controllers.

For full OpenSSF criteria details, refer to [docs/OPENSSF_SECURITY.md](./docs/OPENSSF_SECURITY.md).
