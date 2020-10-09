const { createCanvas, loadImage } = require('canvas');
const FastAverageColor = require('fast-average-color');
const fac = new FastAverageColor();

//color function
async function printAverageColor(filename) {
    const img = await loadImage(filename);
    const { width, height } = img;

    const canvas =  createCanvas(width, height);
    const ctx =  canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    const imageData =  ctx.getImageData(0, 0, width, height);

    let imageColorArray= [
        {SAC:   fac.getColorFromArray4(imageData.data,  { algorithm: 'simple'}) },
        {SQAC:   fac.getColorFromArray4(imageData.data) },
        {DAC:  fac.getColorFromArray4(imageData.data, { algorithm: 'dominant'})}
    ]

    // console.log(`Filename: ${filename}, size: ${width}×${height}`);
    //console.log('// [red, green, blue, opacity]');
    //console.log(imageColorArray)
    return imageColorArray

}

exports.printAverageColor = printAverageColor