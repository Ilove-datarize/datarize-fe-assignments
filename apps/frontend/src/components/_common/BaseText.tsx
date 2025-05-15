import styled from '@emotion/styled'
import { JSX } from 'react'

type Alignment = 'center' | 'leading' | 'trailing'

const TEXT_ALIGNMENT_BY_ALIGNMENT: Record<Alignment, string> = {
  leading: 'left',
  trailing: 'right',
  center: 'center',
}

type TextElement = keyof Pick<
  JSX.IntrinsicElements,
  'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'div' | 'span' | 'li'
>

export interface BaseTextProps extends React.Attributes {
  alignment?: Alignment
  /**
   * @default span
   */
  as?: TextElement
  color?: string
  fontWeight?: number
  fontSize?: number
}

export const BaseText: React.FC<BaseTextProps & JSX.IntrinsicElements[TextElement]> = ({
  as = 'span',
  fontSize = 17,
  fontWeight = 400,
  children,
  ...props
}) => {
  return (
    <Base as={as} fontSize={fontSize} fontWeight={fontWeight} {...props}>
      {children}
    </Base>
  )
}

const Base = styled.span<BaseTextProps>`
  ${({ fontSize }) => fontSize && `font-size: ${fontSize}px;`};
  ${({ fontWeight }) => fontWeight && `font-weight: ${fontWeight};`};
  ${({ color }) => color && `color: ${color}`};
  ${({ alignment }) => alignment && `text-align: ${TEXT_ALIGNMENT_BY_ALIGNMENT[alignment]}`};
`
