import emotionReset from 'emotion-reset'
import { css } from '@emotion/react'

export const globalStyles = css`
  ${emotionReset}

  body {
    display: flex;
    margin: 0;
    padding: 0;
    height: 100vh;
    button {
      cursor: pointer;
      background: none;
      border: none;
      padding: 0;
      margin: 0;
    }
    @supports (height: 100dvh) {
      height: 100dvh;
    }
  }

  #root,
  .app {
    display: flex;
    flex: 1;
  }

  *,
  *::after,
  *::before {
    box-sizing: border-box;
  }
`
