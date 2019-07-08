import { parse, formatRelative } from "date-fns/esm";

export default function(datestring) {
  var date = parse(datestring, "yyyy-MM-dd HH:mm:ss", new Date());
  return formatRelative(date, new Date());
}
