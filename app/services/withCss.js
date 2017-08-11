import CSSModules from 'react-css-modules'

export default function withCss(style) {
    return CSSModules(style, {allowMultiple: true})
}
