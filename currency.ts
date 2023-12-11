import axios from "axios";

type ExchangeRateType = {
  currency_pair: string;
  exchange_rate: number;
};

export const convertCurrencyFromUSDToSEK = async (amount: number) => {
  const { data } = await axios.get<ExchangeRateType>(
    `https://api.api-ninjas.com/v1/exchangerate?pair=USD_SEK`
  );
  return amount * data.exchange_rate;
};
