import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
// import {connect} from 'react-redux'

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
            <div>
                开始啦
            </div>
        )
    }
}



export default Index;

