import ReactDom from 'react-dom'
import React, {PureComponent} from 'react'
import {Router, Route, Switch} from 'react-router'
import {createMemoryHistory} from 'history'
import store from '@/redux/store'
import {Provider} from 'react-redux'
import Main from '@/components/main'
import CanvasImage from '@/components/getImageColor'

const history = createMemoryHistory()

class App extends PureComponent {
    constructor(props){
        super(props)
    }
    render() {
        return (
            <Provider store={store}>
                <Router history={history}>
                    <Switch>
                        <Route path="/" component={CanvasImage}/>
                        <Route path="/Main" component={Main}/>
                    </Switch>
                </Router>
            </Provider>
        )
    }
}
ReactDom.render((<App />), document.getElementById('app'))
