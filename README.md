# What is this package?

The core logic for a Settlers game instance.

# Project structure

- `src`: sources files
- `tst`: test files
- `build`: build directory for compiled typescript
- `doc`: directory for compiled docs
- `dist`: directory for code to distribute. This is `settlers.js`, `settlers.d.ts`
  and `settlers.js.map`. This package is only ever a devDependency so we don't worry
  about bundling with webpack.
