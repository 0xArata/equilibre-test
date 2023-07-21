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
    _text: '4 years',
    _value: 1460,
  },
};

export const PercentageData: DataT = {
  percent25: {
    _value: 0.25,
    _text: '25',
  },

  percent50: {
    _value: 0.5,
    _text: '50',
  },

  percent75: {
    _value: 0.75,
    _text: '75',
  },

  percent100: {
    _value: 1,
    _text: '100',
  },
};
