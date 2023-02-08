import glob from 'glob';
import path from 'path';
import fs from 'fs';
import { hexColorRegex,strictRgbaReg, convertRgbaColors, convertHexColors, shortHandHexColor, generateCssVariables } from './util';

glob(path.join(__dirname, '../../app_hybrid_v10/src/**/*.*(vue|css|less|scss)'), (err, matchedPath) => {
    if (err) throw err;
    // 1. 把 rgba 但是透明度是 0 的 直接换成 transparent 如 rgba(255, 255, 255, 0) => transparent
    // 2. 把 rgba 但是透明度是 1 的 直接换成 rgb 如 rgba(255, 255, 255, 1) => rgb(255, 255, 255)
    // 3. 把 scss 函数 rgba(#000, 0.2) 转成 rgba(0, 0, 0, 0.2)
    // 4. 把 hex 十六位长度 但是最后两位是 00 的 直接换成 transparent 如 #aaaaaa00 => transparent
    // 5. 把 hex 十六位长度 但是最后两位是 ff 的 直接去掉最后两位  如 #aaaaaaff => #aaaaaa
    // 6. 把 六位同名值缩减到三位 如 #888888 => #888
    // 7. rgb/rgba 保留，生成的 variable 用 - 分隔开 如 rgba(240, 72, 72, 0.3) => --color-240-72-72-03
    matchedPath.forEach((filePath) => {
        const fileName = path.basename(filePath);
        fs.readFile(filePath, { encoding: 'utf-8' }, (err, data) => {
            if (err) throw err;
            // change rgb to hex before replace it to css variable
            const replacedData = data
                .replace(strictRgbaReg, (matchedColor) => convertRgbaColors(matchedColor))
                .replace(new RegExp(hexColorRegex, 'ig'), (matchedColor) => convertHexColors(matchedColor))
                .replace(new RegExp(hexColorRegex, 'ig'), (matchedColor) => shortHandHexColor(matchedColor))
                .replace(new RegExp(hexColorRegex, 'ig'), (matchedColor) => matchedColor.toLowerCase())
                .replace(new RegExp(strictRgbaReg, 'ig'), (matchedColor) => generateCssVariables(matchedColor))
                .replace(new RegExp(hexColorRegex, 'ig'), (matchedColor) => generateCssVariables(matchedColor));
            
            
            fs.writeFile(filePath, replacedData, (err) => {
                if (err) throw err;
                console.log(`Update ${fileName} success!`);
            });
        });
    });
});
