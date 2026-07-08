# Security Policy

## Supported Versions

This project currently supports security fixes on the latest published state of the default branch.

## Reporting a Vulnerability

Please do not open a public GitHub issue for suspected vulnerabilities.

Please report findings privately to `info@teddschreiner.de`. Include:

- A clear description of the issue
- Steps to reproduce
- Potential impact
- Any suggested mitigation

We aim to acknowledge reports within 5 business days and will coordinate disclosure once a fix or mitigation is available.

## Scope Notes

This is a static web application with file-based prompt content. Common review areas include:

- Accidental inclusion of secrets in prompt files or docs
- Unsafe client-side rendering changes
- Supply-chain issues in dependencies
- Misleading deployment or configuration defaults
