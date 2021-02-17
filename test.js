import React from 'react'
import useDisclosure from './'
import { render, configure, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

configure({ testIdAttribute: 'id' })

const Test = props => {
  const { toggleProps, contentProps } = useDisclosure({ id: props.id })

  return (
    <>
      <button {...toggleProps}>Toggle</button>
      <div className="disclosure" {...contentProps}>
        <p>
          Something hidden with <a href="/">focusable elements</a>
        </p>
      </div>
    </>
  )
}

describe('The useDisclosure hook', () => {
  it('should pass proper toggle props', () => {
    render(<Test id="test-1" />)

    const toggle = screen.getByRole('button')

    expect(toggle).toHaveAttribute('id', 'test-1-toggle')
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    expect(toggle).toHaveAttribute('aria-controls', 'test-1-content')
  })

  it('should pass proper content props', () => {
    render(<Test id="test-1" />)

    const toggle = document.getElementById('test-1-content')

    expect(toggle).toHaveAttribute('id', 'test-1-content')
    expect(toggle).toHaveAttribute('aria-hidden', 'false')
    expect(toggle).toHaveAttribute('aria-labelledby', 'test-1-toggle')
  })
})
