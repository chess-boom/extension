# Extension

## Status

[![NodeJS with Webpack](https://github.com/chess-boom/extension/actions/workflows/webpack.yml/badge.svg)](https://github.com/chess-boom/extension/actions/workflows/webpack.yml)[![Lint Code Base](https://github.com/chess-boom/extension/actions/workflows/super-linter.yml/badge.svg)](https://github.com/chess-boom/extension/actions/workflows/super-linter.yml)

## Dev Dependencies

```
npm install --save-dev
```

## Build

```
npm run build
```

## Importing to Chrome / Chromium

1. Navigate to [chrome://extensions/](chrome://extensions/)
2. Click `Load Unpacked`
3. Choose the `dist` (or `build`) folder
4. To debug, use the `Inspect views` link i the extension card

## Debug

### Generating an API Token

- navigate to [https://lichess.org/account/oauth/token](https://lichess.org/account/oauth/token)
- Click the plus icon on the top right
- Add a generic description like "Chess Boom Debug"
- Under `"PLAY GAMES"` select `challenge:read` permissions
- Click create and copy the output personal access token
- Paste it into `background.ts`:
  ```js
    const token = "lip_********************";
  ```
