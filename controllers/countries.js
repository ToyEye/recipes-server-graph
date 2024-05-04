import { Country } from "../model/index.js";

export const getCountries = async () => {
  const data = await Country.find({});
  console.log(data);
  return data;
};

export const getCountry = async (_, { country }) => {
  return await Country.findOne({ country: country });
};
