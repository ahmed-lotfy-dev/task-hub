# Task Hub - Contributing Guide

First off, thank you for considering contributing to Task Hub! It's people like you that make Task Hub such a great tool.

## 1. Code of Conduct
By participating in this project, you agree to abide by our code of conduct. Please be respectful and professional in all interactions.

## 2. Setting Up for Contribution
Follow the instructions in the [Development Guide](./DEVELOPMENT.md) to set up your local environment.

## 3. Style Guidelines
- **TypeScript**: Use strict type-checking. Prefer `interface` over `type` for public APIs.
- **Naming**: Use `camelCase` for variables and functions, `PascalCase` for classes and types, and `kebab-case` for file names in the `shared` and `api` directories.
- **Tailwind CSS**: (If applicable) Use utility classes but keep components modular.
- **Commit Messages**: Write human-like, descriptive commit messages.

## 4. Pull Request Process
1. Create a new branch for your feature or bugfix: `git checkout -b feat/your-feature-name`.
2. Make your changes and ensure tests pass: `bun test`.
3. Push your branch and open a Pull Request.
4. Provide a clear description of the changes and link any related issues.

## 5. Reporting Issues
If you find a bug or have a feature suggestion, please open an issue on GitHub. Use a descriptive title and provide as much context as possible.
