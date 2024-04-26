import { Country } from "../model/index.js";

export const getCountry = async () => {
  return await Country.find({});
};

export const getCountries = async (_, { country }) => {
  return Country.findOne({ country: country });
};
