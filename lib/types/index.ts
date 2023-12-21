export type PriceHistoryItem = {
  price: number;
};

export type User = {
  email: string;
};

export type Product = {
  _id?: string;
  url: string;
  image: string;
  title: string;
  currentPrice: number | 0;
  originalPrice: number | 0;
  priceHistory: PriceHistoryItem[] | [];
  highestPrice: number | 0;
  lowestPrice: number | 0;
  averagePrice: number | 0;
  discountRate: string;
  description: string;
  category: string;
  reviewsCount: string;
  stars: string;
  isOutOfStock: Boolean;
};

export type NotificationType =
  | "WELCOME"
  | "CHANGE_OF_STOCK"
  | "LOWEST_PRICE"
  | "THRESHOLD_MET";

export type EmailContent = {
  subject: string;
  body: string;
};

export type EmailProductInfo = {
  title: string;
  url: string;
};
