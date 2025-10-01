export function validateInput(value: string) {

  const cleanValue = value.replace(/<[^>]*>?/gm, '');
  const regex = /^[\p{L}0-9\s.,!?¡?:)(#\-_*+;"'`]+$/u;
  const isValid = regex.test(cleanValue);
  return { value: cleanValue, isValid };
  
}
