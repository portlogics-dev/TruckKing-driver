import dayjs, { extend } from "dayjs";
import utc from "dayjs/plugin/utc";

extend(utc);

export const localizedDayjs = (utcString: string) => dayjs(utcString).local();
