const response = await axios.post('https://mo-inda.shop/users/login', option);

export const login = async (payload) => {
  const data = await instance.post('users/login', payload);
  return data;
};
