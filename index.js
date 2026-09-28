import {
  AnalyticsService,
  CustomerNotifier,
  RestaurantService,
} from "./notification.js";
import { CreatedState } from "./order.js";
import {
  CashOnDeliveryPayment,
  CreditCardPayment,
  UPIPayment,
} from "./payment.js";

/**
 * Low-Level Design (LLD): Simplified Order Delivery System
 *
 * Design Patterns Used:
 * 1. Strategy Pattern: For swappable payment methods (Credit Card, UPI, Cash on Delivery).
 * 2. Observer Pattern: To notify services (Customer, Analytics, Restaurant) on order events.
 * 3. State Pattern: To handle order lifecycle states & enforce transition rules.
 */

// ==========================================
// CONTEXT: Order
// ==========================================

class Order {
  constructor(id, amount, paymentStrategy) {
    this.id = id;
    this.amount = amount;
    this.paymentStrategy = paymentStrategy;
    this.observers = [];
    this.state = new CreatedState();
  }

  // Observer management
  attach(observer) {
    this.observers.push(observer);
  }

  detach(observer) {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }

  notify(event, details = {}) {
    for (const observer of this.observers) {
      observer.update(this, event, details);
    }
  }

  // Strategy Pattern (Payment)
  processPayment() {
    if (!this.paymentStrategy) {
      console.log(
        `[Payment] No payment strategy selected for Order #${this.id}.`,
      );
      return;
    }
    this.paymentStrategy.pay(this.amount);
  }

  setPaymentStrategy(paymentStrategy) {
    this.paymentStrategy = paymentStrategy;
  }

  // State Pattern Transitions
  setState(state) {
    this.state = state;
  }

  getStateName() {
    return this.state.name;
  }

  create() {
    console.log(
      `\n=== Creating Order #${this.id} (Total: ₹${this.amount}) ===`,
    );
    this.processPayment();
    console.log(
      `[Order #${this.id}] Order created! Notifying all subscribed services...`,
    );
    this.notify("ORDER_CREATED");
  }

  confirm() {
    this.state.confirm(this);
  }

  prepare() {
    this.state.prepare(this);
  }

  outForDelivery() {
    this.state.outForDelivery(this);
  }

  deliver() {
    this.state.deliver(this);
  }

  cancel(reason) {
    this.state.cancel(this, reason);
  }

  reject(reason) {
    this.state.reject(this, reason);
  }
}

// ==========================================
// DEMONSTRATION / TEST CASES
// ==========================================

function runDemonstration() {
  // Shared observers
  const customerNotifier = new CustomerNotifier();
  const analyticsService = new AnalyticsService();
  const restaurantService = new RestaurantService();

  console.log("==================================================");
  console.log("SCENARIO 1: Happy Path to Delivery (Paid via UPI)");
  console.log("==================================================");
  const order1 = new Order("ORD-101", 450, new UPIPayment());
  order1.attach(customerNotifier);
  order1.attach(analyticsService);
  order1.attach(restaurantService);

  order1.create();
  order1.confirm();
  order1.prepare();
  order1.outForDelivery();
  order1.deliver();

  console.log("\n==================================================");
  console.log("SCENARIO 2: Cannot Cancel Once Out For Delivery");
  console.log("==================================================");
  const order2 = new Order("ORD-102", 720, new CreditCardPayment());
  order2.attach(customerNotifier);
  order2.attach(analyticsService);

  order2.create();
  order2.confirm();
  order2.prepare();
  order2.outForDelivery();

  // Attempting to cancel when OutForDelivery
  console.log(
    "\n--- Attempting to cancel Order ORD-102 after OutForDelivery ---",
  );
  order2.cancel("Customer changed mind");

  console.log("\n==================================================");
  console.log("SCENARIO 3: Restaurant Rejects Order (COD)");
  console.log("==================================================");
  const order3 = new Order("ORD-103", 299, new CashOnDeliveryPayment());
  order3.attach(customerNotifier);
  order3.attach(analyticsService);
  order3.attach(restaurantService);

  order3.create();

  // Restaurant rejects order
  console.log("\n--- Restaurant cannot fulfill the order ---");
  order3.reject("Restaurant is out of ingredients / closed");
}

runDemonstration();
