# React Accessible Disclosure

`react-a11y-disclosure` is a simple React hook to make [accessible disclosure widgets](https://www.w3.org/TR/wai-aria-practices-1.1/). It essentially provides all the necessary attributes—especially ARIA attributes—to be sent to the DOM on both the toggle and the content container so the widget is accessible to assistive technologies.

- [Install](#install)
- [Usage](#usage)
- [Examples](#examples)
  - [Simple disclosure](#simple-disclosure)
  - [Controlled disclosure](#controlled-disclosure)
  - [Connected disclosures](#connected-disclosures)
- [Styling](#styling)
- [Non-button toggles](#non-button-toggles)
- [Demo (Code Sandbox) ↗](https://codesandbox.io/s/react-a11y-disclosure-6l7pj)

## Install

```sh
npm install --save react-a11y-disclosure
```

## Usage

```js
import useDisclosure from 'react-a11y-disclosure'

const YourComponent = () => {
  const {
    // The props to spread on the disclosure toggle, typically a button
    toggleProps,
    // The props to spread on the disclosure content, typically a div
    contentProps,
    // Whether the widget is currently expanded (`true` or `false`)
    isExpanded,
    // A function to toggle the state of the widget, if needed
    toggle,
  } = useDisclosure({
    // A unique identifier from which will be extrapolated two IDs:
    // - `${props.id}-toggle` for the disclosure toggle
    // - `${props.id}-content` for the disclosure content
    id: 'unique-identifier',
    // The default state of the widget if uncontrolled, or the current state of
    // the widget if controlled (see examples)
    isExpanded: true,
  })
}
```

## Examples

### Simple disclosure

By default, the hook is said to be “uncontrolled”. That means it can be used as is without the application having to maintain the state of the widget. The current state of the hook is also returned as `isExpanded`.

```jsx
import useDisclosure from 'react-a11y-disclosure'

const SimpleDisclosure = () => {
  const { toggleProps, contentProps, isExpanded } = useDisclosure({
    id: 'test-uncontrolled',
  })

  return (
    <>
      {/**
       * ⚠️ Because the toggle receives the `aria-expanded` attribute as part of
       * `toggleProps`, its content should not vary between states, as this is
       * already implied by the presence of this attribute. So the button label
       * should be explicit about the action, but not changing like “Open” /
       * “Close” or “Show” / “Hide”.
       * See: https://twitter.com/goetsu/status/1370729035156779014
       */}
      <button {...toggleProps}>Toggle {isExpanded ? '↑' : '↓'}</button>

      <div className="disclosure" {...contentProps}>
        …
      </div>
    </>
  )
}
```

When using server-side rendering and supporting the absence of JavaScript in the client, it is recommended to make the disclosure widget expanded by default so the content is visible and accessible while JavaScript loads.

If you are not using SSR and not supporting a JavaScript-less experience, the widget could be started as collapsed by default. To do so, pass the `isExpanded` prop to `false`.

```js
const { toggleProps, contentProps, isExpanded } = useDisclosure({
  id: 'test-uncontrolled',
  isExpanded: false,
})
```

### Controlled disclosure

If the state should be controlled above by the application, the hook will react to the `isExpanded` value it receives and updates the returned props accordingly.

```jsx
import useDisclosure from 'react-a11y-disclosure'

const ControlledDisclosure = () => {
  const [isExpanded, setIsExpanded] = React.useState(true)
  const { toggleProps, contentProps } = useDisclosure({
    id: 'test-controlled',
    isExpanded,
  })

  return (
    <>
      <button {...toggleProps} onClick={() => setIsExpanded(value => !value)}>
        Toggle {isExpanded ? '↑' : '↓'}
      </button>
      <div className="disclosure" {...contentProps}>
        …
      </div>
    </>
  )
}
```

### Connected disclosures

Connected toggles are disclosure widgets whose state depend on the state of other related disclosure widgets. This is a pattern commonly used for accordion menus, where only one entry can be open at once, thus collapsing the others.

```jsx
const ConnectedToggles = () => {
  const [isExpanded, setIsExpanded] = React.useState(null)
  const { toggleProps: togglePropsA, contentProps: contentPropsA } =
    useDisclosure({ id: 'A', isExpanded: isExpanded === 'A' })
  const { toggleProps: togglePropsB, contentProps: contentPropsB } =
    useDisclosure({ id: 'B', isExpanded: isExpanded === 'B' })
  const { toggleProps: togglePropsC, contentProps: contentPropsC } =
    useDisclosure({ id: 'C', isExpanded: isExpanded === 'C' })

  return (
    <>
      <button
        {...togglePropsA}
        onClick={() =>
          setIsExpanded(isExpanded => (isExpanded === 'A' ? null : 'A'))
        }
      >
        Toggle A
      </button>
      <div className="disclosure" {...contentPropsA}>
        …
      </div>
      <button
        {...togglePropsB}
        onClick={() =>
          setIsExpanded(isExpanded => (isExpanded === 'B' ? null : 'B'))
        }
      >
        Toggle B
      </button>
      <div className="disclosure" {...contentPropsB}>
        …
      </div>
      <button
        {...togglePropsC}
        onClick={() =>
          setIsExpanded(isExpanded => (isExpanded === 'C' ? null : 'C'))
        }
      >
        Toggle C
      </button>
      <div className="disclosure" {...contentPropsC}>
        …
      </div>
    </>
  )
}
```

## Styling

The hook does not provide the `style` or `className` props. It mainly toggles ARIA attributes. The styling is left to the discretion of the implementor (you). The simplest way to make it work would be to add a class to the content containers and hide them when they are collapsed, like so:

```css
.disclosure[aria-hidden='true'] {
  display: none;
}
```

For animation purposes, the CSS could be authored as such:

```css
.disclosure {
  transition: 250ms;
  max-height: 10em;
}

/**
 * 1. `visibility: hidden` is very important in case `display: none` is not 
 *    specified, as this is what removes the content from the accessibility tree
 *    and therefore prevents focusable children from being focused while the 
 *    widget is collapsed.
 */
.disclosure[aria-hidden='true'] {
  max-height: 0;
  opacity: 0;
  visibility: hidden; /* 1 */
}
```

Whatever CSS solution you come up with, **make sure the content is removed from the accessibility tree while collapsed** so focusable children cannot be focused while the widget is collapsed. This can be done with `display: none`, `visibility: hidden` or the `hidden` HTML attribute.

## Non-button toggles

The best element for the toggle definitely is a `<button>` but in some cases, it might be necessary to use a different element, such as a `<span>`. In that case, make sure to pass `role="button"` as well as `tabIndex={0}`, and remove the `type` attribute with `type={undefined}`.

```jsx
<span {...toggleProps} role="button" tabIndex={0} type={undefined}>
  Toggle {isExpanded ? '↑' : '↓'}
</span>
```

Additionally, add the following CSS declaration in order to work around [a bug with Safari Mobile 7+](https://developer.mozilla.org/en-US/docs/Web/API/Element/click_event#safari_mobile).

```css
[role='button'] {
  cursor: pointer;
}
```
