const { createCanvas, loadImage } = require('canvas');
const FastAverageColor = require('fast-average-color');
const fac = new FastAverageColor();

//Color function
async function printAverageColor(filename) {
    const img = await loadImage(filename);
    const { width, height } = img;

    const canvas =  createCanvas(width, height);
    const ctx =  canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    const imageData =  ctx.getImageData(0, 0, width, height);
    //The image color array information array
    let imageColorArray= [
        {SAC:   fac.getColorFromArray4(imageData.data,  { algorithm: 'simple'}) },
        {SQAC:   fac.getColorFromArray4(imageData.data) },
        {DAC:  fac.getColorFromArray4(imageData.data, { algorithm: 'dominant'})}
    ]

    return imageColorArray

}

exports.printAverageColor = printAverageColor