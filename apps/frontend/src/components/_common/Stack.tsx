import styled from '@emotion/styled'

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: React.CSSProperties['flexDirection']
  wrap?: React.CSSProperties['flexWrap']
  align?: React.CSSProperties['alignItems']
  justify?: React.CSSProperties['justifyContent']
  gap?: number
}

export const Stack = styled.div<StackProps>`
  display: flex;
  ${({ direction }) => direction && `flex-direction: ${direction}`};
  ${({ wrap }) => wrap && `flex-wrap: ${wrap}`};
  ${({ align }) => align !== undefined && `align-items: ${align}`};
  ${({ justify }) => justify !== undefined && `justify-content: ${justify}`};
  ${({ gap }) => gap && `gap: ${gap}px`};
`
