export const baseApiURL = "https://api.hakush.in/gi";

export function match<T, U>(
    input: T,
    options: Array<[T, U]>,
    defaultVal: U
): U {
    const matchFound = options.find((option) => {
        if (option[0] == input) {
            return true;
        }
        return false;
    });
    if (matchFound != null) {
        return matchFound[1];
    }
    return defaultVal;
}

export function normalize(
    value: number,
    { min, max }: { min?: number; max?: number }
): number {
    if (max != null && value > max) {
        return max;
    }
    if (min != null && value < min) {
        return min;
    }
    return value;
}

export function sumArray(inputArray: number[]): number {
    return inputArray.reduce(
        (prevValue, currValue) => prevValue + currValue,
        0
    );
}

export function multArray(inputArray: number[]): number {
    return inputArray.length == 0
        ? 0
        : inputArray.reduce((prevValue, currValue) => prevValue * currValue, 1);
}

export function $(selector: string): NodeListOf<Element> {
    return document.querySelectorAll(selector);
}

export function takeUntil<T extends Array<U>, U>(
    array: T,
    condition: (currentItem: U, previousItem?: U | null, array?: T) => boolean
): U[] {
    const output = [];

    let prevElement = null;
    for (let index = 0; index < array.length; index++) {
        const element = array[index];

        if (condition(element, prevElement, array)) {
            break;
        }

        output.push(element);
        prevElement = element;
    }

    return output;
}
