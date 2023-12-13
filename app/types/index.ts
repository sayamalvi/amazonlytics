export type PriceHistoryItem = {
  price: number;
};
export type User = {
  email: string;
};
export type Product = {
  _id?: string;
  title: string;
  currentPrice: string;
  originalPrice: string;
  priceHistory: PriceHistoryItem[] | [];
  img: string;
  category: string;
  highestPrice: number;
  lowestPrice: number;
  outOfStock: boolean;
};
