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
) {
    if (max != null && value > max) {
        return max;
    }
    if (min != null && value < min) {
        return min;
    }
    return value;
}

export function sumArray(inputArray: number[]) {
    return inputArray.reduce(
        (prevValue, currValue) => prevValue + currValue,
        0
    );
}

export function multArray(inputArray: number[]) {
    return inputArray.length == 0
        ? 0
        : inputArray.reduce((prevValue, currValue) => prevValue * currValue, 1);
}
export function $(selector: string) {
    return document.querySelectorAll(selector);
}
