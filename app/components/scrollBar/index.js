import React, {PureComponent} from 'react'
import withCss from '@/services/withCss'
import styles from './scrollBar.less'
import throttle from 'lodash/throttle'

@withCss(styles)
class ScrollBar extends PureComponent {
    constructor(props) {
        super(props)
        this.innerRef = null;
        this.layerRef = null;
    }
    state = {
        thumbStyle: {}
    }
    componentDidMount(){
        this.layerRef.addEventListener('scroll', this.loadScroll);
    }
    loadScroll = (e) => {
        let el = e.target,
            scrollTop = this.layerRef.scrollTop,
            offsetHeight = this.layerRef.offsetHeight,
            // thumbHeight = (offsetHeight * offsetHeight / (this.innerRef.offsetHeight - offsetHeight)) /offsetHeight * 100,
            thumbHeight = ( offsetHeight * offsetHeight / this.innerRef.offsetHeight),
            top = scrollTop/(this.innerRef.offsetHeight - offsetHeight) * (offsetHeight - thumbHeight),
            thumbStyle = {};

        // console.log('scrollTop: ' + el.scrollTop + ' scrollHeight: ' + el.scrollHeight+ ' offsetHeight: ' + offsetHeight )

        thumbStyle = {
            height: thumbHeight,
            transform: `translateY(${top}px)`
        }

        this.setState({
            thumbStyle,
        })
    }
    render() {
        let {thumbStyle} = this.state;

        return (
            <div styleName="container" >
                <section styleName="layer" ref={(el) => this.layerRef = el }>
                    <div styleName="inner" ref={(el) => this.innerRef = el }>
                        {this.props.children}
                    </div>
                </section>
                <div styleName="scrollTrack">
                    <div styleName="scrollThumb" style={thumbStyle}>

                    </div>
                </div>
            </div>
        )
    }
}

export default ScrollBar;