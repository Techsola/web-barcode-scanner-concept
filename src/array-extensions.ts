interface Array<T> {
    maxBy(selector: (item: T) => any | any[]): T | undefined;
}

Array.prototype.maxBy = function(selector) {
    let maxValues: [] | undefined = undefined;
    let maxItem = undefined;

    for (const item of this) {
        let values = selector(item);
        if (!Array.isArray(values)) values = [values];

        if (maxValues === undefined || lexicographicCompare(values, maxValues) > 0) {
            maxValues = values;
            maxItem = item;
        }
    }

    return maxItem;

    function lexicographicCompare(left: any[], right: any[]) {
        if (left.length != right.length)
            throw new Error('Array lengths do not match');

        for (let i = 0; i < left.length; i++) {
            const leftElement = left[i];
            const rightElement = right[i];
            if (leftElement < rightElement) return -1;
            if (leftElement > rightElement) return 1;
        }

        return 0;
    }
};
