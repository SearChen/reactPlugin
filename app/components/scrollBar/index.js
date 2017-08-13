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
        this.initThumb()
        this.layerRef.addEventListener('scroll', this.loadScroll);
    }
    initThumb = () => {
        let offsetHeight = this.layerRef.offsetHeight,
            thumbHeight = ( offsetHeight * offsetHeight / this.innerRef.offsetHeight);
        this.setState({
            thumbHeight
        })
    }
    loadScroll = (e) => {
        let el = e.target,
            scrollTop = this.layerRef.scrollTop,
            offsetHeight = this.layerRef.offsetHeight,
            // thumbHeight = (offsetHeight * offsetHeight / (this.innerRef.offsetHeight - offsetHeight)) /offsetHeight * 100,
            thumbHeight = ( offsetHeight * offsetHeight / this.innerRef.offsetHeight),
            top = el.scrollTop / (el.scrollHeight - this.offsetHeight) * (1 - this.offsetHeight / this.lastScrollHeight) * 100,
            thumbStyle = {};


        console.log(
           'lay: ' + this.layerRef.scrollTop + ',,offsetHeight: ' + this.layerRef.offsetHeight
        )

        console.log(
           'inner: ' + this.innerRef.scrollTop + ',,offsetHeight: ' + this.innerRef.offsetHeight
        )

        if (scrollTop + thumbHeight >= offsetHeight) {
            // scrollTop =  offsetHeight - (scrollTop + thumbHeight)
        }
        thumbStyle = {
            height: thumbHeight,
            top: top
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