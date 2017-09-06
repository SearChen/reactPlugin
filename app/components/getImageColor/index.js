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
        this.colorArrays = [[], [], [], [], []];
        this.resetPoints = [];
        this.repeatArrays = [];
    }

    state = {
        smallStyle: [],
        aloneStyle: null
    }

    static propTypes = {}

    componentDidMount() {
    }

    componentWillUnMount() {

    }

    CanvasImage = (image) => {
        this.canvas = document.createElement('canvas');
        // document.body.appendChild(this.canvas);
        this.context = this.canvas.getContext('2d');
        this.width = this.canvas.width = image.naturalWidth;
        this.height = this.canvas.height = image.naturalHeight;
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
        let palette, length = 0,allValue = [], test = false;//[216,217, 211];

        if (test) {
            console.log(this.getHSV(test))
        } else {
            palette = this.getPalette(this.img0);
            console.log(palette)

            console.time('----------- loop');
            let {pixels} = palette, quality = 4;
            for (let i = 0, r, g, b, a; i <= pixels.length; i = i + quality) {
                r = pixels[i];
                g = pixels[i + 1];
                b = pixels[i + 2];
                a = pixels[i + 3];
                // If pixel is mostly opaque and not white
                if (a > 0) {
                    if (!(pixels[i] === pixels[0] && pixels[i + 1] === pixels[1] && pixels[i + 2] === pixels[2])) {
                        let hsv = this.getHSV([r, g, b]),
                            {h,s,v} = hsv;
                        if (!((0 <= h&& h <= 180) && (0 <= s && s <= 15) && (v === 255))){
                               this.readRange(hsv, i, [pixels[i], pixels[i + 1], pixels[i + 2]]);
                                length++;
                        }
                    }
                }
            }
            console.timeEnd('----------- loop')

            console.time('++++++++++++ loop');

            for (let l = 0; l < this.colorArrays.length; l++) {
                let obj = this.getRepeatNum(this.colorArrays[l], true),
                    keys = Object.keys(obj),
                    values = Object.values(obj),
                    max = _max(values);
                allValue = allValue.concat(values);
                // values.map((v, i) => max === v && console.log('分类：' + l + ' 下标： ' + keys[i] + ' 百分比：' + max / length + '  ----- max ' + max + '  length ' + length +
                //                     ' 色值： ' + ColorValue[l][1][keys[i]]))
            }
            this.getPercent(allValue, length);
            // console.log(this.colorArrays)
            console.timeEnd('++++++++++++ loop')
        }
    }

    getCompete = () => {
        let c = document.getElementById('test'), canContext = c.getContext('2d');
        canContext.drawImage(this.img0, 0, 0, this.width, this.height);

        let imgData = canContext.getImageData(0, 0, this.width, this.heigth), data = imgData.data;
        // resetArray = new Uint8Array([0,0,0,255, 0,0,0,255, 0,0,0,255, 0,0,0,255]),
        // let imgData = canContext.createImageData(800, 800),  data = imgData.data;
        // let data = imgData.data;

        for (var j = 0; j <= data.length; j += 4) {
            for (var k = 0; k < this.resetPoints.length; k++) {
                if (data[j] === this.resetPoints[k]) {
                    data[j] = 255;
                    data[j + 1] = 0;
                    data[j + 2] = 0;
                    // data[j + 3] = 255;
                }
            }
        }
        canContext.putImageData(imgData, 0, 0);
    }
    getHSV = (f) => {
        let max = _max(f), v = max, min = _min(f), s = (max - min) / max,
            index = f.indexOf(max), h;
        if (f[[0]] === f[1]) {
            index = 1;
        } else if (f[0] === f[2]) {
            index = 2;
        } else if (f[1] === f[2]) {
            index = 0;
        }
        switch (index) {
            case 0:
                h = Math.round(60 * (f[1] - f[2]) / (max - min));
                break;
            case 1:
                h = 120 + Math.round(60 * (f[2] - f[0]) / (max - min));
                break;
            case 2:
                h = 240 + Math.round(60 * (f[0] - f[1]) / (max - min));
                break;
            default:
                break;
        }
        s = Math.floor(s * 255.0);
        h = Math.round(h / 2);
        return {
            h, s, v
        }
    }
    readRange = (hsv, index, rgb) => {
        let {h, s, v} = hsv;
        for (let i = 0; i < ColorValue.length; i++) {
            let values = ColorValue[i][0];
            for (let j = 0; j < values.length; j++) {
                if (values[j][0][0] <= h && h <= values[j][0][1]) {
                    if (values[j][1][0] <= s && s <= values[j][1][1]) {
                        if (values[j][2][0] <= v && v <= values[j][2][1]) {
                            this.colorArrays[i].push(j);
                            if(!this.repeatArrays[i]){
                                 this.repeatArrays[i] = 1;
                            } else {
                                this.repeatArrays[i]++;
                            }
                            if(i ===0 && j === 3){
                                this.resetPoints.push(index)
                            }
                        }
                    }
                }
            }
        }
    }
    getRepeatNum = (array, f) => { //获取数量
        var map = {};
        for (var i = 0; i < array.length; i++) {
            var ai = array[i];
            if (!map[ai]) {
                map[ai] = 1;
            } else {
                map[ai]++;
            }
        }
        f && console.log(map)
        return map;
    }

    getPercent = (allValue, length) => {
        let sortValue = allValue.sort(function(a, b){ return a -b;});
        sortValue = sortValue.reverse();
        
        for (let l = 0; l < this.colorArrays.length; l++) {
            let obj = this.getRepeatNum(this.colorArrays[l]),
                keys = Object.keys(obj),
                values = Object.values(obj);

           values.map((v, i) =>{
                if(v === sortValue[0]){
                    console.log('类：' + l + ' 下标： ' + keys[i] + ' 百分比：' + sortValue[0] / length + '  ----- max ' + sortValue[0] + '  length ' + length +
                                    ' 色值： ' + ColorValue[l][1][keys[i]])
                }  if(v === sortValue[1]) {
                    console.log('类：' + l + ' 下标： ' + keys[i] + ' 百分比：' + sortValue[1] / length + '  ----- max ' + sortValue[1] + '  length ' + length +
                                                        ' 色值： ' + ColorValue[l][1][keys[i]])
                }  if(v === sortValue[2]){
                    console.log('类：' + l + ' 下标： ' + keys[i] + ' 百分比：' + sortValue[2] / length + '  ----- max ' + sortValue[2] + '  length ' + length +
                                                        ' 色值： ' + ColorValue[l][1][keys[i]])
                }
           })
        }
    }

    rendFile = () => {
    }

    render() {
        let {smallStyle, aloneStyle} = this.state;
        return (
            <div styleName="container">
                <button type="button" onClick={() => this.rendFile()}>读文件</button>
                <img src={`worker/0199.jpg`} ref={(el) => this.img0 = el}/>
                <button type="button" onClick={() => this.getRGB()}> 提取</button>
                <button type="button" onClick={() => this.getCompete()}>区别点</button>
                主色：
                {
                    aloneStyle ? <span style={{backgroundColor: `rgb(${aloneStyle})`}}></span> : null
                }
                辅助色：
                {
                    smallStyle && smallStyle.map((color, i) => {
                        return <span key={'color-' + i} style={{backgroundColor: `rgb(${color})`}}></span>
                    })
                }
                <canvas id="test" width="800" height="800"></canvas>
            </div>
        )
    }
}

export default Index;

