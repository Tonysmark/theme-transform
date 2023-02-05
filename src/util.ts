import path from 'path';
import { readFileSync } from 'fs';
import glob from 'glob';

export const hexColorRegex = /#[a-fA-F0-9]{3,8}/;
export const rgbOrRgbaColorRegex = /rgb\(.*?\)|rgba\(.*?\)/;

export const getFileColors = () => {
    glob(path.join(__dirname, '../../app_hybrid_v10/src/**/*.*(vue|css|less|scss)'), (err, matchedPath) => {
        console.log('total files: ' + matchedPath.length);
        const matchedColorSet = matchedPath.reduce((acc, cur) => {
            const data = readFileSync(path.resolve(cur));
            const dataString = data.toString();
            const matched = dataString.match(/#[a-fA-F0-9]{3,8}|rgb\(.*?\)|rgba\(.*?\)/gi);
            if (Array.isArray(matched)) {
                const _matched = matched.map((item) => rgb2hex(item));
                return acc.add(..._matched);
            }
            return acc;
        }, new Set());
        console.log('matchedColorSet : ', matchedColorSet);
    });
};

/**
 *
 * @param {String} rgbColor
 * @returns {String} hex color
 * @description to convert rgb or rgba color to hex code
 */
export const rgb2hex = (rgbColor) => {
    let hexColor = '';
    if (rgbColor.includes('rgb(')) {
        const [rgb] = rgbColor
            .trim()
            .replace(/[^0-9,]/gi, '')
            .split(',');
        const r = Number(rgb[0]).toString(16);
        const g = Number(rgb[1]).toString(16);
        const b = Number(rgb[2]).toString(16);
        hexColor = '#' + r + g + b;
        return hexColor;
    }
    if (rgbColor.includes('rgba(')) {
        const rgb = rgbColor
            .trim()
            .replace(/[^0-9,\.]/gi, '')
            .split(',');
        const r = Number(rgb[0]).toString(16);
        const g = Number(rgb[1]).toString(16);
        const b = Number(rgb[2]).toString(16);
        const a = Number((rgb[3] * 255).toFixed(0)).toString(16);
        hexColor = '#' + r + g + b + a;
        return hexColor;
    }
    return rgbColor;
};
