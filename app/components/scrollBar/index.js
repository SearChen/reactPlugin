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
        thumbStyle: {},
        moveState: null,
    }
    VERTICAL = 'vertial'
    HORIZONTAL = 'horizontal'
    componentDidMount(){
        this.initHeight()
        this.layerRef.addEventListener('scroll', this.loadScroll);
        // this.layerRef.addEventListener('mousemove', this.handleHandlerMouseMove);
        // this.layerRef.addEventListener('mouseup', this.handleHandlerMouseUp);
    }
    initHeight = () => {
        let offsetHeight = this.layerRef.offsetHeight,
            thumbHeight = ( offsetHeight * offsetHeight / this.innerRef.offsetHeight);
        this.setState({
            thumbStyle: {
                height: thumbHeight
            }
        })
    }
    loadScroll = (e) => {
        let scrollTop = this.layerRef.scrollTop,
            offsetHeight = this.layerRef.offsetHeight,
            thumbHeight = ( offsetHeight * offsetHeight / this.innerRef.offsetHeight),
            top = scrollTop/(this.innerRef.offsetHeight - offsetHeight) * (offsetHeight - thumbHeight), //滚动top比重 ＊ 容器高度余量
            thumbStyle = {};

        thumbStyle = {
            height: thumbHeight,
            transform: `translateY(${top}px)`
        }

        this.setState({
            thumbStyle,
        })
    }
    handleVerticalHandlerMouseDown = (e) => {
        let lastContainerScrollTop = this.layerRef.scrollTop,
            lastContainerScrollLeft = this.layerRef.scrollLeft,
            {thumbStyle: {height}} = this.state,
            offsetHeight = this.layerRef.offsetHeight,
            thumbHeight = ( offsetHeight * offsetHeight / this.innerRef.offsetHeight),
            top = lastContainerScrollTop/(this.innerRef.offsetHeight - offsetHeight) * (offsetHeight - thumbHeight)

        this.lastMousePos = {
            top: e.clientY,
        };

        console.log('height:  '+height+ '....' + lastContainerScrollTop + '....' + (lastContainerScrollTop - height))


        this.setState({
            thumbStyle: Object.assign(this.state.thumbStyle, {transform: `translateY(${top}px)`})
        })
        // this.setState({moveState: this.VERTICAL });
    }
    handleHandlerMouseMove = (e) => {
        let {moveState} = this.state;
        if (moveState === this.VERTICAL){
            console.log('vv')
        }
        if(moveState === this.HORIZONTAL){
            console.log('hh')
        }

    }
    handleHandlerMouseUp = () => {
        this.setState({
            moveState: null,
        })
    }
    render() {
        let {thumbStyle} = this.state;

        return (
            <div styleName="container">
                <section styleName="layer" ref={(el) => this.layerRef = el }>
                    <div styleName="inner" ref={(el) => this.innerRef = el }>
                        {this.props.children}
                    </div>
                </section>
                <div styleName="scrollTrack">
                    <div styleName="scrollThumb" style={thumbStyle}
                         onMouseDown={(e) => this.handleVerticalHandlerMouseDown(e) }>
                    </div>
                </div>
            </div>
        )
    }
}

export default ScrollBar;