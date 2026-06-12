export const parseFields = (fields: any) => {
  const result: any = {};

  for (const key in fields) {
    result[key] = fields[key].value;
  }

  return result;
};