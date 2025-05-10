export type Range<
  Start extends number,
  End extends number,
  Acc extends number[] = [],
  Flag extends boolean = false
> = Acc["length"] extends End
  ? Flag extends true
    ? Acc[number]
    : never
  : Range<
      Start,
      End,
      [...Acc, Acc["length"]],
      Flag | (Acc["length"] extends Start ? true : false)
    >;
