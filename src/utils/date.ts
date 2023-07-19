import { add, differenceInDays, format } from "date-fns";

export const formatDate = (date: Date, formatType = 'yyyy-MM-dd') => format(date, formatType)

export const addDate = (date: Date, duration: Duration) => add(date, duration)

export const getDaysDiff = (date1: Date, date2: Date) => differenceInDays(date1, date2)
