import { Country } from "../model/index.js";

export const getCountries = async () => {
  return await Country.find({});
};

export const getCountry = async (_, { country }) => {
  return await Country.findOne({ country: country });
};
