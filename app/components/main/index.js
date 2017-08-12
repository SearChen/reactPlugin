import React, {PureComponent} from 'react'
import withCss from '@/services/withCss'
import styles from './main.less'
import ScrollBar from 'Components/scrollBar'
// import PropTypes from 'prop-types'
// import {connect} from 'react-redux'


@withCss(styles)
class Index extends PureComponent {
    constructor(props) {
        super(props)
    }

    state = {
        windowMode: 1,      //窗口状态
    }

    static propTypes = {
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleResize, false)
    }

    componentWillUnMount() {
        window.removeEventListener('resize', this.handleResize)
    }

    handleResize = () => {
        console.log('resize', Date.now())
    }

    render() {
        return (
            <div styleName="container">
                <ScrollBar>
                    开始啦
                    <div styleName="img"></div>
                    <div styleName="img"></div>
                </ScrollBar>
            </div>
        )
    }
}

export default Index;

