export const hexColorRegex = /#[a-fA-F0-9]{3,8}/;
export const rgbOrRgbaColorRegex = /rgb\(.*?\)|rgba\(.*?\)/;
export const strictRgbaReg = /rgba?\((\d{0,3})\s*,\s*(\d{0,3})\s*,\s*(\d{0,3})\s*,?\s*([\.\d]+?)?\)/gm;

export const alpha2hex = (alpha: number) => {
    if (alpha < 0 || alpha > 1) return '';
    let hex = Math.round(alpha * 255).toString(16);
    if (hex.length < 2) hex = '0' + hex;
    return hex;
};

export const rgb2hex = (color: string) => {
    /**
     * 有以下几种 case:
     * 1. rgb(230, 19, 63)  ==>  #e6133f
     * 2. rgba(221,74,50,0.9)  ==>  #dd4a32e6
     * 3. rgba(#b938ef, 0.8)  ==>  #b938efcc
     * 4. rgba($primary-color, 0.8)  ==>  rgba($primary-color, 0.8)
     * 5. #fbfbf0  ==>  #fbfbf0
     */
    if (color.match(hexColorRegex) && !color.match(rgbOrRgbaColorRegex)) return color;
    const valArr = color.replace(/^rgba?\(|\s+|\)$/g, '').split(',');
    if (valArr.length === 2) {
        if (valArr[0].match('#')) {
            return `${valArr[0]}${alpha2hex(Number(valArr[1]))}`;
        }
        return color;
    }
    if (valArr.length === 3 || valArr.length === 4) {
        // 第二三种情况
        return (
            '#' +
            valArr
                .map((string) => parseFloat(string)) // Converts them to numbers
                .map((number, index) => (index === 3 ? Math.round(number * 255) : number)) // Converts alpha to 255 number
                .map((number) => number.toString(16)) // Converts numbers to hex
                .map((string) => (string.length === 1 ? '0' + string : string)) // Adds 0 when length of one number is 1
                .join('')
        );
    }
};

export const convertRgbaColors = (color: string) => {
    // 1. 把 rgba 但是透明度是 0 的 直接换成 transparent 如 rgba(255, 255, 255, 0) => transparent
    // 2. 把 rgba 但是透明度是 1 的 直接换成 rgb 如 rgba(255, 255, 255, 1) => rgb(255, 255, 255)
    const valArr = color.replace(/^rgba\(|\s+|\)$/g, '').split(',');
    const alpha = valArr[3];
    if (alpha === 'undefined') return color;
    const _alpha = parseFloat(alpha);
    if (_alpha === 0) return 'transparent';
    if (_alpha === 1) {
        return `rgb(${valArr[0]}, ${valArr[1]}, ${valArr[2]})`;
    }
    return color;
};

export const convertHexColors = (color: string) => {
    // 3. 把 hex 8位长度 但是最后两位是 00 的 直接换成 transparent 如 #aaaaaa00 => transparent
    // 4. 把 hex 8位长度 但是最后两位是 ff 的 直接去掉最后两位  如 #aaaaaaff => #aaaaaa
    const hexColor = color.trim();
    const hasSharp = hexColor.charAt(0) === '#';
    if (!hasSharp) {
        return color;
    }
    if (/#[a-fA-F0-9]{8}/.test(hexColor)) {
        // 6位长度
        const a = hexColor.slice(-2);
        const rgb = hexColor.slice(0, -2);
        if (a === '00') {
            return 'transparent';
        }
        if (a === 'ff') {
            return rgb;
        }
        return hexColor;
    }
    return color;
};

export const shortHandHexColor = (color: string) => {
    // 5. 把 六位同名值缩减到三位 如 #888888 => #888
    const shortHandKey = color[1];
    if (color.indexOf(shortHandKey.repeat(6)) !== -1 && color.replace('#', '').length === 6) {
        return `#${shortHandKey.repeat(3)}`;
    }
    return color;
};

export const generateCssVariables = (color: string) => {
    if (color.match(new RegExp(hexColorRegex, 'gm'))) {
        return `var(--color-${color.replace('#', '')})`;
    } else {
        // 剩下的就是 rgb rgba 这类数据了
        return `var(--color-${color
            .replace(/^rgba?\(|\s+|\)$/g, '')
            .split(',')
            .map((item) => item.replace('.', ''))
            .join('-')})`;
    }
};
