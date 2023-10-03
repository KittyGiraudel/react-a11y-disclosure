import React from 'react'
import useDisclosure from './'
import { render, configure, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'

configure({ testIdAttribute: 'id' })

const Widget = ({ toggleProps, contentProps }) => (
  <>
    <button {...toggleProps}>Toggle</button>
    <div className="disclosure" {...contentProps}>
      <p>
        Something hidden with <a href="/">focusable elements</a>
      </p>
    </div>
  </>
)

const Uncontrolled = ({ id, isExpanded }) => {
  const { toggleProps, contentProps } = useDisclosure({ id, isExpanded })

  return <Widget toggleProps={toggleProps} contentProps={contentProps} />
}

const Controlled = ({ id }) => {
  const [isExpanded, setIsExpanded] = React.useState(true)
  const { toggleProps, contentProps } = useDisclosure({ id, isExpanded })

  return (
    <Widget
      toggleProps={{ ...toggleProps, onClick: () => setIsExpanded(v => !v) }}
      contentProps={contentProps}
    />
  )
}

describe('The `useDisclosure` hook', () => {
  it('should pass proper toggle props', () => {
    render(<Uncontrolled id="disclosure" />)

    const toggle = screen.getByRole('button')

    expect(toggle).toHaveAttribute('id', 'disclosure-toggle')
    expect(toggle).toHaveAttribute('type', 'button')
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    expect(toggle).toHaveAttribute('aria-controls', 'disclosure-content')
  })

  it('should pass proper content props', () => {
    render(<Uncontrolled id="disclosure" />)

    const content = document.getElementById('disclosure-content')

    expect(content).toHaveAttribute('id', 'disclosure-content')
    expect(content).toHaveAttribute('aria-hidden', 'false')
    expect(content).toHaveAttribute('aria-labelledby', 'disclosure-toggle')
  })

  it('should use given `isExpanded` value', () => {
    render(<Uncontrolled id="disclosure" isExpanded={false} />)

    const toggle = screen.getByRole('button')
    const content = document.getElementById('disclosure-content')

    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(content).toHaveAttribute('aria-hidden', 'true')
  })

  it('should toggle the props on click', () => {
    render(<Uncontrolled id="disclosure" />)

    const toggle = screen.getByRole('button')
    const content = document.getElementById('disclosure-content')

    fireEvent.click(toggle)

    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(content).toHaveAttribute('aria-hidden', 'true')
  })

  it('should be controllable', () => {
    render(<Controlled id="disclosure" />)

    const toggle = screen.getByRole('button')
    const content = document.getElementById('disclosure-content')

    fireEvent.click(toggle)

    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(content).toHaveAttribute('aria-hidden', 'true')
  })
})
