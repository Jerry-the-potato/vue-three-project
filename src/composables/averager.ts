// fps計算器
export default function useAverager(length: number = 60){
    const secondList = new Array(length).fill(0.0167);
    let index = 0;
    let average = 0.0167;
    let fps = 60;
    function updateValue(value: number){
        secondList[index] = value;
        index = (++index >= length) ? 0 : index;
        // same as below:
        // 	index++;
        // 	if(index >= length) index = 0;
        // concept:
        // 	i = (++i > 99) ? 0 : i
    }
    function getAverage(){
        average = 1 / length * secondList.reduce((sum, second) => {
            return sum + second;
        })
        return average;
    }
    function getFPS(){
        fps = 1 / getAverage();
        return fps;
    }
    return{
        updateValue,
        getAverage,
        getFPS,
    }
}