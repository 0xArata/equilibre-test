export interface DurationT {
  _value: number;
  _text: string;
}

export interface DataT {
  [key: string]: DurationT;
}

export const DurationData: DataT = {
  oneWeek: {
    _text: '1 week',
    _value: 7,
  },

  oneMonth: {
    _text: '1 month',
    _value: 30,
  },

  oneYear: {
    _text: '1 year',
    _value: 365,
  },

  fourYears: {
    _text: '4 year',
    _value: 1460,
  },
};
