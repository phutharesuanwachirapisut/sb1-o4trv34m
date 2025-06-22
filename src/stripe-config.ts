export interface StripeProduct {
  priceId: string;
  name: string;
  description: string;
  mode: 'payment' | 'subscription';
  price?: string;
  currency?: string;
}

export const stripeProducts: StripeProduct[] = [
  {
    priceId: 'price_1RbzptR9EITXQuWquMT0xaaA',
    name: 'Pro Plan',
    description: 'Advanced AI property analysis with comprehensive market insights and forecasting tools',
    mode: 'subscription',
    price: '$10.00/month',
    currency: 'USD'
  },
  {
    priceId: 'price_1RbzfRR9EITXQuWqN5upVF2o',
    name: 'Premium Plan',
    description: 'Complete property intelligence suite with unlimited access to all premium features',
    mode: 'subscription',
    price: '$20.00/month',
    currency: 'USD'
  }
];

export const getProductByPriceId = (priceId: string): StripeProduct | undefined => {
  return stripeProducts.find(product => product.priceId === priceId);
};

export const getProductsByMode = (mode: 'payment' | 'subscription'): StripeProduct[] => {
  return stripeProducts.filter(product => product.mode === mode);
};