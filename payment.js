// ==========================================
// 1. STRATEGY PATTERN: Payment Methods
// ==========================================

class PaymentStrategy {
    pay(amount) {
        throw new Error("pay() must be implemented by concrete strategy.");
    }
}

export class CreditCardPayment extends PaymentStrategy {
    pay(amount) {
        console.log(`[Payment: Credit Card] Successfully paid ₹${amount} via Credit Card.`);
    }
}

export class UPIPayment extends PaymentStrategy {
    pay(amount) {
        console.log(`[Payment: UPI] Successfully paid ₹${amount} via UPI.`);
    }
}

export class CashOnDeliveryPayment extends PaymentStrategy {
    pay(amount) {
        console.log(`[Payment: Cash on Delivery] Payment set to COD. ₹${amount} will be collected upon delivery.`);
    }
}