import { addDate, formatDate } from "@/utils/date";
import { Duration } from "date-fns";

export const percents = [25, 50, 75, 100];

export const lockDays: {
  name: string;
  duration: Duration
}[] = [
    {
      name: '1 Week',
      duration: {
        weeks: 1
      },
    },
    {
      name: '1 Month',
      duration: {
        months: 1
      },
    },
    {
      name: '1 Year',
      duration: {
        years: 1
      },
    },
    {
      name: '4 Years',
      duration: {
        years: 4
      }
    },
  ];

export const votingPower = 1461
export const defaultExpiryDate = formatDate(addDate(new Date, { years: 4 }))
export const COINGECKO_URL = "https://api.coingecko.com/api/v3/simple"