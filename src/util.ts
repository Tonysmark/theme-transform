export const hexColorRegex = /#[a-fA-F0-9]{3,8}/;
export const rgbOrRgbaColorRegex = /rgb\(.*?\)|rgba\(.*?\)/;

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
