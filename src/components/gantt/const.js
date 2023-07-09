import dayjs from 'dayjs';

export const segmentedOptions = [
  { label: '年', value: 'year' },
  { label: '月', value: 'month' },
  { label: '日', value: 'day' },
  { label: '时', value: 'hour' },
];

export const weeks = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];


export const dayFormat = (date) => {
  return ` ${dayjs(date).format('MM-DD')} ${weeks[dayjs(date).day()]}`;
};

export const zoomConfig = {
  levels: [
   
    {
      name: 'day',
      scale_height: 50,
      min_column_width: 80,
      scales: [
        { unit: 'year', step: 1, format: '%Y' },
        { unit: 'day', step: 1, format: dayFormat },
      ],
    },
    // {
    //   name: 'hour',
    //   scale_height: 50,
    //   min_column_width: 80,
    //   scales: [
    //     { unit: 'day', step: 1, format: dayFormat },
    //     { unit: 'hour', step: 1, format: "%H:%i" },
    //   ],
    // },
    {
      name: 'month',
      scale_height: 30,
      min_column_width: 50,
      scales: [
        { unit: 'month', format: '%F, %Y' },
      ],
    },
    {
      name: 'year',
      scale_height: 50,
      min_column_width: 30,
      scales: [{ unit: 'year', step: 1, format: '%Y' }],
    },
  ],
};


