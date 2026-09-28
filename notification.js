// ==========================================
// 2. OBSERVER PATTERN: Notification Observers
// ==========================================

class OrderObserver {
    update(order, event, details = {}) {
        throw new Error("update() must be implemented by concrete observer.");
    }
}

export class CustomerNotifier extends OrderObserver {
    update(order, event, details = {}) {
        if (event === "ORDER_CREATED") {
            console.log(`[CustomerNotifier] Hello Customer! Your order #${order.id} has been created successfully.`);
        } else if (event === "ORDER_CANCELLED") {
            console.log(`[CustomerNotifier] Alert! Order #${order.id} was cancelled. Reason: ${details.reason || "N/A"}`);
        } else {
            console.log(`[CustomerNotifier] Order #${order.id} status updated to '${order.getStateName()}'.`);
        }
    }
}

export class AnalyticsService extends OrderObserver {
    update(order, event, details = {}) {
        console.log(`[AnalyticsService] Logged event '${event}' for Order #${order.id} (Amount: ₹${order.amount}).`);
    }
}

export class RestaurantService extends OrderObserver {
    update(order, event, details = {}) {
        if (event === "ORDER_CREATED") {
            console.log(`[RestaurantService] New order #${order.id} arrived for restaurant review.`);
        }
    }
}