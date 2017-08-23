import React, {PureComponent} from 'react'
import {ColorThiefWrapper, ColorThief} from '@/services/colorThiefService'
import {ColorRange, colorRangeName, BlackRange, blackRangeName, DarkGrayRange, darkGrayName, LightGrayRange, lightGrayName, WhiteRange, whiteRangeName} from '@/services/hsv'
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

        palette = colorThief.getPalette(this.img0, 8);
        console.log(palette)

        for (let i = 0; i < palette.length; i++){
            let hsv = this.getColor(palette[i])
            // console.log('hsv: ' )
            // console.log(hsv)
            this.readRange(hsv);
        }


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

        s = s * 255.0;

       switch (index){
           case 0:
               h = Math.round(60 * (f[1] - f[2]) / (max - min));
               break;
           case 1:
               h = 120 + Math.round(60 * (f[2] - f[0]) / (max - min));
               break;
           case 2:
               h = 240 + Math.round(60 * (f[0] - f[1]) / (max - min));
               break;
           default: break;
       }
       h = h/2;
        // console.log(
        //     'H: ' + h +
        //     ' S : ' + s +
        //     ' V : ' + v
        // )
       return {
           h, s, v
       }
    }

    readRange = (hsv) => {

        this.arrayCompate(ColorRange, hsv, 'colorRangeName', colorRangeName);
        this.arrayCompate(BlackRange, hsv, 'blackRangeName', blackRangeName);
        this.arrayCompate(DarkGrayRange, hsv, 'darkGrayName', darkGrayName);
        this.arrayCompate(LightGrayRange, hsv, 'lightGrayName', lightGrayName);
        this.arrayCompate(WhiteRange, hsv, 'whiteRangeName', whiteRangeName);
    }
    arrayCompate = (array, hsv, title, colorName) => {
        for (let i = 0; i < array.length; i++){
            let {h, s, v} = hsv;
            if (array[i][0][0] <= h &&  h < array[i][0][1]){
                if(array[i][1][0] <= s &&  s < array[i][1][1]){
                    if(array[i][2][0] <= v &&  v < array[i][2][1]){
                        console.log(h +' s: '+ s + ' v: ' + v)
                        console.log(title + ' value: '+array[i] +' 当前索引：' + i +' 数据值：' + colorName[i])
                    }
                }
            }
        }

    }

    rendFile = () => {
        // let path = 'worker/', files = fs.readdir(path, function (err, files) {
        //     if (err) {
        //         console.log('err');
        //     }
        //     files.forEach(function (file) {
        //         console.log(file)
        //     })
        // });
    }

    render() {
        let {smallStyle, aloneStyle} = this.state;
        return (
            <div styleName="container">
                <button type="button" onClick={() => this.rendFile()}>读文件</button>
                <img src={`worker/050.jpg`} ref={(el) => this.img0 = el }/>
                <button type="button" onClick={() => this.getRGB()}> 提取</button>
                主色：
                {
                     aloneStyle ?<span style={{backgroundColor: `rgb(${aloneStyle})` }}></span> : null
                }
                辅助色：
                {
                    smallStyle && smallStyle.map((color, i) => {
                        return <span key={'color-' + i} style={{backgroundColor: `rgb(${color})` }}></span>
                    })
                }
                <div></div>
            </div>
        )
    }
}

export default Index;

