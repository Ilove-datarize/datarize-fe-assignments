import { render } from '@testing-library/react'
import { Stack } from './Stack'
import { describe, expect, it } from 'vitest'

describe('Stack', () => {
  it('자식 요소를 렌더링해야 합니다.', () => {
    const { getByText } = render(
      <Stack>
        <div>Child Content</div>
      </Stack>,
    )
    expect(getByText('Child Content')).toBeInTheDocument()
  })

  it('direction prop이 제공되었을 때 flex-direction 스타일을 적용해야 합니다.', () => {
    const { getByTestId } = render(
      <Stack direction="row" data-testid="stack">
        <span />
      </Stack>,
    )
    const stack = getByTestId('stack')
    expect(stack).toHaveStyle('flex-direction: row')
  })

  it('wrap prop이 제공되었을 때 flex-wrap 스타일을 적용해야 합니다.', () => {
    const { getByTestId } = render(
      <Stack wrap="wrap" data-testid="stack">
        <span />
      </Stack>,
    )
    expect(getByTestId('stack')).toHaveStyle('flex-wrap: wrap')
  })

  it('align prop이 제공되었을 때 align-items 스타일을 적용해야 합니다.', () => {
    const { getByTestId } = render(
      <Stack align="center" data-testid="stack">
        <span />
      </Stack>,
    )
    expect(getByTestId('stack')).toHaveStyle('align-items: center')
  })

  it('justify prop이 제공되었을 때 justify-content 스타일을 적용해야 합니다.', () => {
    const { getByTestId } = render(
      <Stack justify="space-between" data-testid="stack">
        <span />
      </Stack>,
    )
    expect(getByTestId('stack')).toHaveStyle('justify-content: space-between')
  })

  it('gap prop이 제공되었을 때 gap 스타일을 적용해야 합니다.', () => {
    const { getByTestId } = render(
      <Stack gap={10} data-testid="stack">
        <span />
      </Stack>,
    )
    expect(getByTestId('stack')).toHaveStyle('gap: 10px')
  })

  it('다른 HTML 속성을 전달해야 합니다.', () => {
    const { getByTestId } = render(
      <Stack id="test-stack" data-testid="stack">
        <span />
      </Stack>,
    )
    const stack = getByTestId('stack')
    expect(stack).toHaveAttribute('id', 'test-stack')
  })
})
