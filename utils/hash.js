import bcrypt from "bcrypt";

const doHash = (value, saltValue) => {
  const hashedValue = bcrypt.hash(value, saltValue);
  return hashedValue;
};
export default doHash;
