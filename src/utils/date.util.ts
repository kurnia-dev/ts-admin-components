export const formatDate = (date: string, useTime?: boolean) => {
  let dateFormat: DateFormat, timeFormat, timeZone;
  interface DateFormat {
    locale: string;
    year: string;
    month: string;
    day: string;
    weekday?: string;
  }
  dateFormat = {
    locale: 'en-gb',
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
  };

  const userStr = localStorage.getItem('user');

  if (userStr) {
    const user = JSON.parse(userStr);

    if (user.generalSetting.dateFormat) {
      dateFormat = user.generalSetting.dateFormat;
    }

    if (user.generalSetting.timeFormat) {
      timeFormat = user.generalSetting.timeFormat;
    }

    if (user.generalSetting.timezone) {
      timeZone = user.generalSetting.timezone;
    }
  }

  let options: any = {
    year: dateFormat.year,
    month: dateFormat.month,
    day: dateFormat.day,
    weekday: dateFormat.weekday,
    hour12: timeFormat,
    timeZone: timeZone,
  };

  if (useTime) {
    options = {
      ...options,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    };
  }

  return new Date(date).toLocaleString(dateFormat.locale, options);
};
