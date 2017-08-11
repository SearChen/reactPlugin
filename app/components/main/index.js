import React, {PureComponent} from 'react'
import withCss from '@/services/withCss'
import styles from './main.less'
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
            <div styleName="scrollbar">
                开始啦
                <p>
                </p>
                <p></p>
            </div>
        )
    }
}

export default Index;

