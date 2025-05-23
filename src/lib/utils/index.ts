export const validateUser = (email: string, accessToken: string) => {
  return (
    email === process.env.EMAIL && accessToken === process.env.ACCESS_TOKEN
  );
};
