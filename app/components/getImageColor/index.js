import React, {PureComponent} from 'react'
import {ColorThiefWrapper, ColorThief} from '@/services/colorThiefService'
import withCss from '@/services/withCss'
import styles from './getImage.less'
import _max from 'lodash/max'
import _min from 'lodash/min'


@withCss(styles)
class Index extends PureComponent {
    constructor(props) {
        super(props)
        this.img0 = null;
    }

    state = {
        smallStyle: [],
        aloneStyle: null
    }

    static propTypes = {
    }
    componentDidMount() {
    }
    componentWillUnMount() {
    }
    getRGB = () => {
        let colorThiefWrapper = new ColorThiefWrapper(),
            colorThief = new ColorThief(), palette;

        palette = colorThief.getPalette(this.img0, 9);
        console.log(palette)

        colorThiefWrapper.getColor( this.img0, (colorThief) => {
            this.getColor(colorThief)
            // console.log(colorThief)

            this.setState({
                smallStyle: palette,
                aloneStyle: colorThief
            })
        });


    }
    getColor = (f) => {
        let max = _max(f), v = max, min = _min(f), s = (max - min)/max,
            index = f.indexOf(max), h;

       switch (index){
           case 0:
               h = 60 * (f[1] - f[2]) / (max - min);
               break;
           case 1:
               h = 120 + 60 * (f[2] - f[0]) / (max - min);
               break;
           case 2:
               h = 240 + 60 * (f[0] - f[1]) / (max - min);
               break;
           default: break;
       }
       console.log(
           'H: ' + h +
           ' S : ' + s +
           ' V : ' + v
       )
    }

    render() {
        let {smallStyle, aloneStyle} = this.state;
        return (
            <div styleName="container">
                <img src="imgs/d-3a3d15d359e2f49326fa53b9a3dd4e8c.png" ref={(el) => this.img0 = el }/>
                <button type="button" onClick={() => this.getRGB()}> 提取</button>
                {
                    aloneStyle ?<span style={{backgroundColor: `rgb(${aloneStyle})` }}></span> : null
                }
                {
                    smallStyle && smallStyle.map((color, i) => {
                        return <span key={'color-' + i} style={{backgroundColor: `rgb(${color})` }}></span>
                    })
                }
            </div>
        )
    }
}

export default Index;

