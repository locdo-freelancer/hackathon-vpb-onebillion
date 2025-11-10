import * as bcrypt from 'bcrypt';
const saltOrRounds = 10;

export const hashPasswordHelper = async (plainPassword: string) => {
  try {
    const hashedPassword = await bcrypt.hash(plainPassword, saltOrRounds);
    return hashedPassword;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const hashPasswordCompareHelper = async (
  plainPassword: string,
  hashedPassword: string,
) => {
  try {
    const comparedPassword = await bcrypt.compare(
      plainPassword,
      hashedPassword,
    );
    return comparedPassword;
  } catch (error) {
    throw new Error(error.message);
  }
};
