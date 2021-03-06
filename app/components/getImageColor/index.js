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
    }

    state = {
        smallStyle: [],
        aloneStyle: null,
        width: 0,
        height: 0
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
        this.setState({
            width: image.naturalWidth,
            height: image.naturalHeight
        })
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
        let palette, length = 0, allValue = [], test = false;//[216,217, 211];

        if (test) {
            console.log(this.getHSV(test))
        } else {
            palette = this.getPalette(this.img0);
            console.log(palette)

            console.time('----------- loop');
            let {pixelCount, pixels} = palette, offset, r, g, b, a;
            for (let i = 0; i < pixelCount; i++) {
                offset = i * 4;
                r = pixels[offset];
                g = pixels[offset + 1];
                b = pixels[offset + 2];
                a = pixels[offset + 3];
                // If pixel is mostly opaque and not white
                // if (a > 0) {
                if (!(pixels[offset] === pixels[0] && pixels[offset + 1] === pixels[1] && pixels[offset + 2] === pixels[2])) {
                    let hsv = this.getHSV([r, g, b]),
                        {h, s, v} = hsv;
                    if (!((0 <= s && s <= 15) && (v === 255))) {
                        this.readRange(hsv, i, [r, g, b]);
                        length++;
                    }
                }
                // }
            }
            console.timeEnd('----------- loop')

            console.time('++++++++++++ loop');

            let colorName2Matrix = [];
            for (let i = 0; i < ColorValue.length; i++) {
                let colorName2Index = {};
                let colorNames = ColorValue[i][1];
                for (let j = 0; j < colorNames.length; j++) {
                    colorName2Index[colorNames[j]] = j;
                }
                colorName2Matrix.push(colorName2Index);
            }
            let newColorArray = [];
            for (let l = 0; l < this.colorArrays.length; l++) {
                let colorArray = this.colorArrays[l];
                let jCounts = this.getRepeatNum(colorArray);
                if (l === 0) {
                    Object.keys(jCounts).forEach((j) => {
                        let count = jCounts[j];
                        let colorName = ColorValue[l][1][j];
                        if (colorName.substr(colorName.length - 1, 1) === '2') {
                            let targetColorName = colorName.substr(0, colorName.length - 1);
                            let targetColorNameIndex = colorName2Matrix[l][targetColorName];
                            if (typeof targetColorNameIndex !== 'undefined') {
                                if (jCounts[targetColorNameIndex] === undefined) {
                                    jCounts[targetColorNameIndex] = 0;
                                }
                                jCounts[targetColorNameIndex] += count;
                                jCounts[j] = 0;
                            }
                        }
                    });
                    Object.keys(jCounts).forEach((j) => {
                        newColorArray.push({
                            name: ColorValue[l][1][j],
                            count: jCounts[j]
                        });
                    });
                } else {
                    var k = 0;
                    Object.keys(jCounts).forEach((j) => {
                        k += jCounts[j];
                    });
                    var colorName = "";
                    switch (l) {
                        case 1:
                            colorName = "black";
                            break;
                        case 2:
                            colorName = "darkgray";
                            break;
                        case 3:
                            colorName = "lightgray";
                            break;
                        default:
                            colorName = "white";
                    }
                    newColorArray.push({
                        name: colorName,
                        count: k
                    });
                }
            }
            console.log('length: ' + length)

            let sortedColorArray = newColorArray.sort(function (a, b) {
                return b.count - a.count;
            });
            for (let i = 0; i < 3 && i < sortedColorArray.length; i++) {
                let percent = sortedColorArray[i]['count'] / length;
                if (percent < 0.05) {
                    break;
                }
                console.log("color: " + sortedColorArray[i]['name'] + ', percent: ' + percent);
            }
            console.timeEnd('++++++++++++ loop')
        }
    }

    getCompete = () => {
        let c = document.getElementById('test'), canContext = c.getContext('2d');
        canContext.drawImage(this.img0, 0, 0, this.width, this.height);

        let imgData = canContext.getImageData(0, 0, this.width, this.height), data = imgData.data;
        // resetArray = new Uint8Array([0,0,0,255, 0,0,0,255, 0,0,0,255, 0,0,0,255]),
        // let imgData = canContext.createImageData(800, 800),  data = imgData.data;
        // let data = imgData.data;
        //console.log('----' + canContext.getImageData(1500, 1500, 1, 1).data)
        
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
        let max = _max(f), v = max, min = _min(f), s = v === 0 ? 0 : (v - min) / v,
            index = f.indexOf(max), h;
        if (v - min === 0) {
            h = 0;
        } else {
            if (f[0] === f[1] && index !== 2) {
                index = 0;
            } else if (f[0] === f[2] && index !== 1) {
                index = 2;
            } else if (f[1] === f[2] && index !== 0) {
                index = 1;
            }
            switch (index) {
                case 0:
                    h = Math.round(60 * (f[1] - f[2]) / (v - min));
                    break;
                case 1:
                    h = 120 + Math.round(60 * (f[2] - f[0]) / (v - min));
                    break;
                case 2:
                    h = 240 + Math.round(60 * (f[0] - f[1]) / (v - min));
                    break;
                default:
                    break;
            }
        }
        s = Math.floor(s * 255.0);
        h < 0 && (h += 360);
        h = Math.round(h / 2);

        return {
            h, s, v
        }
    }
    readRange = (hsv, index, rgb) => {
        let {h, s, v} = hsv, i = 0, j = 0;
        for (i = 0; i < ColorValue.length; i++) {
            let values = ColorValue[i][0];
            let nextJ = true;
            for (j = 0; j < values.length && nextJ; j++) {
                if (values[j][0][0] <= h && h <= values[j][0][1]) {
                    if (values[j][1][0] <= s && s <= values[j][1][1]) {
                        if (values[j][2][0] <= v && v <= values[j][2][1]) {
                            this.colorArrays[i].push(j);
                            if (i > 0) {
                                nextJ = false;
                            }
                        }
                    }
                }
            }
        }
    }
    getRepeatNum = (array) => { //获取数量
        var map = {};
        for (var i = 0; i < array.length; i++) {
            var ai = array[i];
            if (!map[ai]) {
                map[ai] = 1;
            } else {
                map[ai]++;
            }
        }
        //console.log(map)
        return map;
    }

    rendFile = () => {
    }

    render() {
        let {smallStyle, aloneStyle, width, height} = this.state;
        return (
            <div styleName="container">
                <button type="button" onClick={() => this.rendFile()}>读文件</button>
                <img src={`worker/03.jpg`} ref={(el) => this.img0 = el}/>
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
                <canvas id="test" width={width} height={height}></canvas>
            </div>
        )
    }
}

export default Index;

