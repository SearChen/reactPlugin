import React, {PureComponent} from 'react'
import withCss from '@/services/withCss'
import styles from './scrollBar.less'

@withCss(styles)
class ScrollBar extends PureComponent {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div styleName="container">
                <section styleName="layer">
                    <div styleName="inner">
                        {this.props.children}
                    </div>
                </section>
                <div styleName="scrollTrack">
                    <div styleName="scrollThumb">

                    </div>
                </div>
            </div>
        )
    }
}

export default ScrollBar;