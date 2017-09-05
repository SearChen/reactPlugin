import React, {PureComponent} from 'react'
import {ColorThiefWrapper, ColorThief} from '@/services/canvasImageService'
import {ColorValue} from '@/services/hsv'
import withCss from '@/services/withCss'
import styles from './getImage.less'
import _max from 'lodash/max'
import _min from 'lodash/min'


@withCss(styles)
class Index extends PureComponent {
    constructor(props) {
        super(props)
        this.img0 = null;
        this.width = null;
        this.height = null;
        this.context = null;
        this.colorArrays= [[],[],[],[],[],[]];
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
    CanvasImage = (image) => {
        this.canvas = document.createElement('canvas');
        document.body.appendChild(this.canvas);
        this.context = this.canvas.getContext('2d');
        this.width = this.canvas.width = image.width;
        this.height = this.canvas.height = image.height;
        this.context.drawImage(image, 0, 0, this.width, this.height);
    }
    getPixelCount = () => {
        return this.width * this.height;
    }
    getPalette = (sourceImage) => {
        this.CanvasImage(sourceImage);

        var imageData = this.context.getImageData(0, 0, this.width, this.height);
        var pixels = imageData.data;
        var pixelCount = this.getPixelCount();

        return {pixelCount, pixels}
    }
    getRGB = () => {
        let palette, length = 0, test = false; //[1,9, 100];

        if (test) {
            console.log(this.getHSV(test))
        }else {
            palette = this.getPalette(this.img0);
            console.log(palette)

            console.time('----------- loop');
            let pixelArray = [], {pixelCount, pixels} = palette, quality = 4;
            for (var i = 0, offset, r, g, b, a; i <= pixelCount; i = i + quality) {
                offset = i * 4;
                r = pixels[i + 0];
                g = pixels[i + 1];
                b = pixels[i + 2];
                a = pixels[i + 3];
                // If pixel is mostly opaque and not white
                if (a >= 125) {
                    if (!(r > 250 && g > 250 && b > 250)) {
                        let hsv = this.getHSV([r, g, b]);
                        // this.readRange(hsv);
                        pixelArray.push(hsv);

                    }
                }
            }
            console.timeEnd('----------- loop')

            console.time('++++++++++++ loop');
            for (let k = 0; k < pixelArray.length; k++) {
                this.readRange(pixelArray[k]);
            }
            console.timeEnd('++++++++++++ loop')

            this.colorArrays.map((v) => length += v.length)

            for (let l = 0; l < this.colorArrays.length; l++) {
                let obj = this.getPercentage(this.colorArrays[l]),
                    values = Object.values(obj), max = _max(values);
                values.map((v, i) => max === v && console.log('分类：' + l + ' 下标： ' + i + ' 百分比：' + max / length + '  ----- max ' + max + '  length ' + length +
                    ' 色值： ' + ColorValue[l][1][i]))
            }
            console.log(this.colorArrays)
        }
    }
    getHSV = (f) => {
        let max = _max(f), v = max, min = _min(f), s = (max - min)/max,
            index = f.indexOf(max), h;
       if (f[[0]] === f[1]){
           index = 1;
       } else if(f[0]===f[2]){
           index = 2;
       } else if(f[1] === f[2]){
            index = 0;
       }
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
       s = Math.floor(s * 255.0);
       h = Math.round(h/2);
       return {
           h, s, v
       }
    }
    readRange = (hsv) => {
        let {h, s, v} = hsv;
        for (let i = 0; i < ColorValue.length; i++){
            let values = ColorValue[i][0];
            for ( let j = 0; j < values.length; j ++) {
                if (values[j][0][0] <= h &&  h < values[j][0][1]){
                    if(values[j][1][0] <= s &&  s < values[j][1][1]){
                        if(values[j][2][0] <= v &&  v < values[j][2][1]){
                            this.colorArrays[i].push(j);
                             // console.log('h: ' + h +' s: '+ s + ' v: ' + v + ' value: '+values[j] + ' 当前分类：' + i +' 当前索引：' + j +' 数据值：' + ColorValue[i][1][j])
                        }
                    }
                }
            }
        }
    }
    getPercentage = (array) => {
        let value = this.getRepeatNum(array);
        console.log(value)
        return value;        
    }
    getRepeatNum = (array) => { //获取数量
        var map = {};
        for(var i = 0; i < array.length; i++){
            var ai = array[i];
            if(!map[ai]){
                map[ai] = 1;
            }else{
                map[ai]++;
            }
        }
        return map;
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
                <img src={`worker/01.jpg`} ref={(el) => this.img0 = el }/>
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

