import React from 'react'

const useDisclosure = props => {
  const [isExpanded, setIsExpanded] = React.useState(
    typeof props.isExpanded !== 'undefined' ? props.isExpanded : true
  )

  React.useEffect(() => {
    typeof props.isExpanded !== 'undefined' && setIsExpanded(props.isExpanded)
  }, [props.isExpanded])

  const toggle = React.useCallback(() => setIsExpanded(v => !v), [])

  const toggleProps = {
    id: props.id + '-toggle',
    onClick: toggle,
    type: 'button',
    'aria-expanded': isExpanded,
    'aria-controls': props.id + '-content',
  }
  const contentProps = {
    id: props.id + '-content',
    'aria-hidden': !isExpanded,
    'aria-labelledby': props.id + '-toggle',
  }

  return { toggleProps, contentProps, isExpanded, toggle }
}

export default useDisclosure
