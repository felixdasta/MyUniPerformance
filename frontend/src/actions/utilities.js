export const randomColor = () => {
    let hex = Math.floor(Math.random() * 0xFFFFFF);
    let color = "#" + hex.toString(16);
    return color;
}

export const GRADE_COLORS = {
    "A's count": "#3dd932",
    "B's count": "#2FDECC",
    "C's count": "#FFCD00",
    "D's count": "#FF9A00",
    "F's count": "#FF0000",
    "P's count": "#009AFF",
    "W's count": "#B5B5B5"
};