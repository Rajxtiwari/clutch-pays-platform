declare module '@cashfreepayments/cashfree-js' {
  export interface CheckoutOptions {
    paymentSessionId: string;
    redirectTarget?: '_modal' | '_self' | '_blank';
    appearance?: {
      width?: string;
      height?: string;
    };
  }

  export interface PaymentResult {
    error?: {
      message: string;
      code: string;
    };
    redirect?: boolean;
    paymentDetails?: {
      paymentSessionId: string;
      orderId: string;
    };
  }

  export interface CashfreeInstance {
    checkout(options: CheckoutOptions): Promise<PaymentResult>;
  }

  export interface LoadOptions {
    mode: 'sandbox' | 'production';
  }

  export function load(options: LoadOptions): Promise<CashfreeInstance>;
}
