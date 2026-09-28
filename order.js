// ==========================================
// STATE PATTERN: Order Lifecycle States
// ==========================================

class OrderState {
    constructor(name) {
        this.name = name;
    }

    confirm(order) {
        console.log(`[Invalid Transition] Cannot confirm order while in '${this.name}' state.`);
    }

    prepare(order) {
        console.log(`[Invalid Transition] Cannot start preparing order while in '${this.name}' state.`);
    }

    outForDelivery(order) {
        console.log(`[Invalid Transition] Cannot mark order out for delivery while in '${this.name}' state.`);
    }

    deliver(order) {
        console.log(`[Invalid Transition] Cannot deliver order while in '${this.name}' state.`);
    }

    cancel(order, reason) {
        console.log(`[Invalid Transition] Cannot cancel order while in '${this.name}' state.`);
    }

    reject(order, reason) {
        console.log(`[Invalid Action] Restaurant cannot reject order while in '${this.name}' state.`);
    }
}

export class CreatedState extends OrderState {
    constructor() {
        super("Created");
    }

    confirm(order) {
        console.log(`[State Transition] Order #${order.id}: Created -> Confirmed`);
        order.setState(new ConfirmedState());
    }

    cancel(order, reason = "Customer cancelled order") {
        console.log(`[State Transition] Order #${order.id}: Created -> Cancelled`);
        order.setState(new CancelledState(reason));
        order.notify("ORDER_CANCELLED", { reason });
    }

    reject(order, reason = "Restaurant rejected the order") {
        console.log(`[Restaurant Action] Restaurant rejected Order #${order.id}. Reason: ${reason}`);
        console.log(`[State Transition] Order #${order.id}: Created -> Cancelled`);
        order.setState(new CancelledState(reason));
        order.notify("ORDER_CANCELLED", { reason });
    }
}

class ConfirmedState extends OrderState {
    constructor() {
        super("Confirmed");
    }

    prepare(order) {
        console.log(`[State Transition] Order #${order.id}: Confirmed -> Preparing`);
        order.setState(new PreparingState());
    }

    cancel(order, reason = "Customer cancelled order") {
        console.log(`[State Transition] Order #${order.id}: Confirmed -> Cancelled`);
        order.setState(new CancelledState(reason));
        order.notify("ORDER_CANCELLED", { reason });
    }

    reject(order, reason = "Restaurant rejected after confirmation") {
        console.log(`[Restaurant Action] Restaurant rejected Order #${order.id}. Reason: ${reason}`);
        console.log(`[State Transition] Order #${order.id}: Confirmed -> Cancelled`);
        order.setState(new CancelledState(reason));
        order.notify("ORDER_CANCELLED", { reason });
    }
}

class PreparingState extends OrderState {
    constructor() {
        super("Preparing");
    }

    outForDelivery(order) {
        console.log(`[State Transition] Order #${order.id}: Preparing -> OutForDelivery`);
        order.setState(new OutForDeliveryState());
    }

    cancel(order, reason = "Customer cancelled while preparing") {
        console.log(`[State Transition] Order #${order.id}: Preparing -> Cancelled`);
        order.setState(new CancelledState(reason));
        order.notify("ORDER_CANCELLED", { reason });
    }
}

class OutForDeliveryState extends OrderState {
    constructor() {
        super("OutForDelivery");
    }

    deliver(order) {
        console.log(`[State Transition] Order #${order.id}: OutForDelivery -> Delivered`);
        order.setState(new DeliveredState());
    }

    cancel(order, reason) {
        // Business Rule: Cannot cancel once out for delivery
        console.log(`[Action Denied] Cannot cancel Order #${order.id} once it is Out for Delivery!`);
    }
}

class DeliveredState extends OrderState {
    constructor() {
        super("Delivered");
    }

    cancel(order, reason) {
        console.log(`[Action Denied] Cannot cancel Order #${order.id}. Order has already been delivered.`);
    }
}

class CancelledState extends OrderState {
    constructor(reason = "") {
        super("Cancelled");
        this.reason = reason;
    }
}
