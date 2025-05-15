import { cleanup, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, it, expect, beforeEach } from 'vitest'
import { BaseText } from './BaseText'

const alignmentMap = [
  ['leading', 'left'],
  ['trailing', 'right'],
  ['center', 'center'],
] as const

describe('BaseText', () => {
  beforeEach(() => {
    cleanup()
  })

  it('기본적으로 span 태그 안에 자식을 렌더링해야 합니다.', () => {
    render(<BaseText>Default Text</BaseText>)
    const element = screen.getByText('Default Text')
    expect(element.tagName).toBe('SPAN')
  })

  it('기본 fontSize와 fontWeight 스타일을 적용해야 합니다.', () => {
    render(<BaseText>Styled Text</BaseText>)
    const element = screen.getByText('Styled Text')
    expect(element).toHaveStyle({ 'font-size': '17px', 'font-weight': '400' })
  })

  it('`as` prop이 제공되었을 때 커스텀 HTML 태그로 렌더링해야 합니다.', () => {
    render(<BaseText as="h1">Heading Text</BaseText>)
    const element = screen.getByText('Heading Text')
    expect(element.tagName).toBe('H1')
  })

  it('fontSize와 fontWeight가 props로 전달되었을 때 이를 적용해야 합니다.', () => {
    render(
      <BaseText fontSize={24} fontWeight={700}>
        Custom Text
      </BaseText>,
    )
    const element = screen.getByText('Custom Text')
    expect(element).toHaveStyle({ 'font-size': '24px', 'font-weight': '700' })
  })

  it('color prop이 제공되었을 때 색상 스타일을 적용해야 합니다.', () => {
    render(<BaseText color="rgba(255,255,255,0.5)">Colored Text</BaseText>)
    const element = screen.getByText('Colored Text')
    expect(element).toHaveStyle({ color: 'rgba(255,255,255,0.5)' })
  })

  it('alignment prop에 따라 text-align 스타일을 적용해야 합니다.', () => {
    alignmentMap.forEach(([alignProp, expected]) => {
      render(<BaseText alignment={alignProp}>Aligned Text</BaseText>)
      const el = screen.getByText('Aligned Text')
      expect(el).toHaveStyle({ 'text-align': expected })
      cleanup()
    })
  })

  it('네이티브 HTML 속성을 DOM 요소에 전달해야 합니다.', () => {
    render(
      <BaseText id="test-id" data-testid="base-text">
        Attr Text
      </BaseText>,
    )
    const element = screen.getByTestId('base-text')
    expect(element).toHaveAttribute('id', 'test-id')
  })
})
