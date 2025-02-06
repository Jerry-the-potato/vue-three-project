import { useMotionPath, type MotionPath } from "./useMotionPath";

export default function SortAlgorithmIterable(){
    
    let secondColumns = [];
    let sortFunction: Generator<boolean, void, unknown> | null = null;
    let sortKey = "";
    let isSorting = false;
    let isStoping = false;
    let timesEveryFrame = 0;
    type SortGeneratorFunction = (columns: Array<Object>) => Generator<boolean, void, unknown>;

    const sortGenerators: Record<string, SortGeneratorFunction> = {
        bubbleSort: bubbleSortMaker,
        selectionSort: selectionSortMaker
    };

    function swapColumn(a: Object, b: Object, frame: number){
        [a.path.pointX, b.path.pointX] = [b.path.pointX, a.path.pointX];
        [a.path.pointY, b.path.pointY] = [b.path.pointY, a.path.pointY];
        [a.height, b.height] = [b.height, a.height];
        a.path.NewTarget(a.x, a.y, frame);
        b.path.NewTarget(b.x, b.y, frame);
    }
    

    function setStepByStep(){
        isSorting = true;
        isStoping = true;
    }
    function start(key: string, columns: Array<Object>){
        secondColumns = []; // 清空上次排序
        // send(name + " is processing");
        sortFunction = sortGenerators[key](columns);
        sortKey = key;
        timesEveryFrame = Math.ceil(columns.length/50);
        isSorting = true;
    }
    function update(){
        if(!isSorting) return;
        if(!sortFunction) return;

        let times = timesEveryFrame;
        while(times--){
            const isNext = sortFunction.next().value;
            if(isNext === false){
                [isStoping, times] = [true, 0];
                const message = sortKey + " is done.";
            }
        }
        if(isStoping){
            isSorting = false;
            isStoping = false;
        }
    }

    // 迭代生成
    function* bubbleSortMaker(columns: Array<Object>) {
        const len = columns.length;
        for (let i = 0; i < len - 1; i++) {
            for (let j = 0; j < len - 1 - i; j++) {
                const a = columns[j];
                const b = columns[j + 1];
                if (a.height > b.height) swapColumn(a, b, 30);
                yield false;
            }
        }
        yield true;
    }
    function* selectionSortMaker(columns: Array<Object>) {
        const len = columns.length;
        for (let i = 0; i < len; i++) {
            let minIndex = i;
            for (let j = i + 1; j < len; j++) {
                const min = columns[minIndex].height;
                const next = columns[j].height;
                if (next < min) minIndex = j;
                yield false;
            }
            if(minIndex == i) continue;
            const a = columns[i];
            const b = columns[minIndex];
            swapColumn(a, b, 30);
        }
        yield true;
    }
    function* insertionSortMaker(columns: Array<Object>) {
        const len = columns.length;
        for (let i = 1; i < len; i++) {
            let key = columns[i].height;
            let j = i - 1;
            while (j >= 0 && columns[j].height > key) {
                const a = columns[j + 1];
                const b = columns[j];
                swapColumn(a, b, 30);
                yield false;
                j--;
            }
        }
        yield true;
    }
    function* shellSortMaker(columns: Array<Object>) {
        const len = columns.length;
        let gap = Math.floor(len / 2);

        while (gap > 0) {
            for (let i = gap; i < len; i++) {
                let j = i;
                while (j >= gap && columns[j - gap].height > columns[j].height) {
                    const a = columns[j];
                    const b = columns[j - gap];
                    swapColumn(a, b, 60);
                    yield false;
                    j -= gap;
                }
            }
            gap = Math.floor(gap / 2);
        }
        yield true;
    }
    function* quickSortMaker(columns, left = 0, right = columns.length - 1) {
        if (left >= right) return;
        const pivotIndex = yield* SortAlgorithmIterable.partition(columns, left, right);
        yield* quickSortMaker(columns, left, pivotIndex - 1);
        yield* quickSortMaker(columns, pivotIndex + 1, right);
        if(left == 0 && right == columns.length - 1) yield true;
    }

    function* partition(columns, left, right) {
        const pivot = columns[right];
        let i = left;
        for (let j = left; j < right; j++) {
            yield false;
            if (columns[j].height < pivot.height) {
                swapColumn(columns[i], columns[j], 30);
                i++;
            }
        }
        swapColumn(columns[i], columns[right], 30);
        return i;
    }

    function* mergeSortMaker(columns, left = 0, right = columns.length - 1) {
        if (left >= right) return;
        const mid = Math.ceil((left + right) / 2);
        yield* mergeSortMaker(columns, left, mid - 1);
        yield* mergeSortMaker(columns, mid, right);
        yield* mergeMaker(columns, left, mid, right);
        if(left == 0 && right == columns.length - 1) yield true;
    }
    
    function* mergeMaker(columns, left, mid, right) {
        secondColumns = JSON.parse(JSON.stringify(columns.slice(left, right + 1)));
        const heights = secondColumns.map((column)=>{return column.height});
        const max = Math.max(...heights);
        // 為每個 column 添加 path 
        secondColumns.forEach((column) => {
            column.path = useMotionPath(column.x, column.y);
            column.path.NewTarget(column.x, column.y - max, 20);
            column.width /= 2; 
        });

        let i = 0; // 左半部分的索引
        let j = mid - left; // 右半部分的索引
        let k = left; // 合併後的索引

        // 合併兩個部分
        while (i <= mid - 1 - left && j <= right - left) {
            yield false;
            if (secondColumns[i].height <= secondColumns[j].height) {
                var b = secondColumns[i];
                i++;
            } else {
                var b = secondColumns[j];
                j++;
            }
            const a = columns[k];
            swapColumn(a, b, 30);
            b.height = 0;
            k++;
        }

        // 如果左邊有剩餘，繼續合併
        while (i <= mid - 1 - left) {
            yield false;
            const a = columns[k];
            const b = secondColumns[i];
            swapColumn(a, b, 30);
            b.height = 0;
            i++;
            k++;
        }

        // 如果右邊有剩餘，繼續合併
        while (j <= right - left) {
            yield false;
            const a = columns[k];
            const b = secondColumns[j];
            swapColumn(a, b, 30);
            b.height = 0;
            j++;
            k++;
        }
    }

    function* heapSortMaker(columns: Array<Object>) {
        const n = columns.length;
        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            yield* heapify(columns, n, i);
        }
        for (let i = n - 1; i > 0; i--) {
            const a = columns[0];
            const b = columns[i];
            swapColumn(a, b, 60);
            yield* heapify(columns, i, 0);
        }
        yield true;
    }
    
    function* heapify(columns, n, i) {
        yield false;
        let largest = i;
        let left = 2 * i + 1;
        let right = 2 * i + 2;
        if (left < n && columns[left].height > columns[largest].height) largest = left;
        if (right < n && columns[right].height > columns[largest].height) largest = right;
        if (largest !== i) {
            const a = columns[largest];
            const b = columns[i];
            swapColumn(a, b, 60);
            yield* heapify(columns, n, largest);
        }
    }

    function* randomSortMaker(columns, frames = 60, TEF = 1){
        timesEveryFrame = TEF;
        const len = columns.length;
        for(let i = 0; i < len; i = i * i + 1){
            for(let j = 0; j < len; j = i + j + 1){
                const a = columns[j];
                const b = columns[(j*j+1) % len];
                swapColumn(a, b, frames);
                yield false;
            }
        }
        yield true;
    }
    function* instantRandomSortMaker(columns: Array<Object>){
        timesEveryFrame = 30;
        yield* randomSortMaker(columns, 30, 30);
    }
}