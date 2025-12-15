type _RangeTo<
    T extends number,
    Arr extends Array<number> = []
> = Arr["length"] extends T
    ? Arr[number]
    : _RangeTo<T, [...Arr, Arr["length"]]>;

type RangeTo<End extends number> = _RangeTo<End>;

export type RangeNum<Start extends number, End extends number> = Exclude<
    RangeTo<End>,
    RangeTo<Start>
>;
