import Map "mo:core/Map";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import CoreOrder "mo:core/Order";
import Iter "mo:core/Iter";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";

import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

// Specify the data migration function in with-clause

actor {
  type MenuItem = {
    id : Nat;
    name : Text;
    price : Nat;
    category : Text;
  };

  type OrderItem = {
    menuItemId : Nat;
    name : Text;
    quantity : Nat;
    price : Nat;
  };

  type Order = {
    id : Nat;
    items : [OrderItem];
    subtotal : Nat;
    discount : Nat;
    total : Nat;
    timestamp : Int;
  };

  type FinalizedOrder = {
    id : Nat;
    items : [OrderItem];
    subtotal : Nat;
    discount : Nat;
    total : Nat;
    timestamp : Int;
    finalized : Bool;
  };

  type UserProfile = {
    name : Text;
  };

  type DailySales = {
    date : Int;
    totalSales : Nat;
  };

  type PreviousDaySales = {
    totalRevenue : Nat;
    totalBills : Nat;
  };

  module MenuItem {
    public func compare(menuItem1 : MenuItem, menuItem2 : MenuItem) : CoreOrder.Order {
      if (menuItem1.id < menuItem2.id) { #less } else if (menuItem1.id == menuItem2.id) { #equal } else { #greater };
    };

    public func compareByCategory(menuItem1 : MenuItem, menuItem2 : MenuItem) : CoreOrder.Order {
      switch (Text.compare(menuItem1.category, menuItem2.category)) {
        case (#equal) {
          if (menuItem1.id < menuItem2.id) {
            #less;
          } else if (menuItem1.id == menuItem2.id) {
            #equal;
          } else { #greater };
        };
        case (order) { order };
      };
    };
  };

  module Order {
    public func compare(order1 : Order, order2 : Order) : CoreOrder.Order {
      if (order1.timestamp < order2.timestamp) { #less } else if (order1.timestamp == order2.timestamp) { #equal } else { #greater };
    };
  };

  // Initialize the user system state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let menuItems = Map.empty<Nat, MenuItem>();
  var orders = List.empty<Order>();
  var finalizedOrders = List.empty<FinalizedOrder>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  var nextOrderId = 1;
  var nextFinalizedOrderId = 1;

  let dayInNanoseconds : Int = 24 * 60 * 60 * 1000000000;

  // Define Int min and max values based on 64-bit range
  let intMinValue : Int = -9223372036854775808;
  let intMaxValue : Int = 9223372036854775807;

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Menu Management - Admin only
  public shared ({ caller }) func addMenuItem(name : Text, price : Nat, category : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    let id = menuItems.size() + 1;
    let item : MenuItem = {
      id;
      name;
      price;
      category;
    };
    menuItems.add(id, item);
    id;
  };

  public shared ({ caller }) func editMenuItem(id : Nat, name : Text, price : Nat, category : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    switch (menuItems.get(id)) {
      case (null) {
        Runtime.trap("Menu item not found");
      };
      case (?_) {
        let updatedItem : MenuItem = {
          id;
          name;
          price;
          category;
        };
        menuItems.add(id, updatedItem);
      };
    };
  };

  public shared ({ caller }) func deleteMenuItem(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    if (not menuItems.containsKey(id)) {
      Runtime.trap("Menu item not found");
    };
    menuItems.remove(id);
  };

  // Menu Queries - Public (no auth required)
  public query func getMenuItemsByCategory() : async [(Text, [MenuItem])] {
    let categories = List.empty<Text>();
    let categoryMap = Map.empty<Text, [MenuItem]>();

    for (item in menuItems.values()) {
      // Check if category exists in categories array
      let existing = categories.toArray().find(func(cat) { Text.equal(cat, item.category) });

      switch (existing) {
        case (null) {
          categories.add(item.category);
          categoryMap.add(item.category, [item]);
        };
        case (?_) {
          switch (categoryMap.get(item.category)) {
            case (null) { categoryMap.add(item.category, [item]) };
            case (?items) {
              let updatedItems = items.concat([item]);
              categoryMap.add(item.category, updatedItems);
            };
          };
        };
      };
    };

    categoryMap.toArray();
  };

  public query func getAllMenuItems() : async [MenuItem] {
    menuItems.values().toArray();
  };

  // Order Finalization - Users and admins can record orders (staff taking orders at the counter)
  public shared ({ caller }) func finalizeOrder(orderItems : [OrderItem], discount : Nat) : async FinalizedOrder {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };
    let subtotal = orderItems.foldLeft(
      0,
      func(acc, item) {
        acc + (item.price * item.quantity);
      },
    );

    // Calculate final total as subtotal minus discount (no tax)
    let total = if (discount > subtotal) { 0 } else { subtotal - discount };
    let timestamp = 0; // Placeholder value until time support is implemented

    let order : FinalizedOrder = {
      id = nextFinalizedOrderId;
      items = orderItems;
      subtotal;
      discount;
      total;
      timestamp;
      finalized = true;
    };

    nextFinalizedOrderId += 1;
    finalizedOrders.add(order);
    order;
  };

  // New function: deleteOrder
  public shared ({ caller }) func deleteOrder(orderId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user)) and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only users or admins can perform this action");
    };

    let filteredOrders = orders.toArray().filter(
      func(order) {
        order.id != orderId;
      }
    );

    orders.clear();
    for (order in filteredOrders.values()) {
      orders.add(order);
    };
  };

  // Order Tracking - Get active (not finalized) orders (Users/admins)
  public query ({ caller }) func getActiveOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user)) and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only users or admins can perform this action");
    };
    orders.toArray();
  };

  // Sales Reports - Now user role required for all callers
  public query ({ caller }) func getDailySalesSummary() : async {
    itemCount : Nat;
    total : Nat;
    discount : Nat;
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };
    let today = 0 / dayInNanoseconds; // Placeholder value until time support is implemented

    var itemCount = 0;
    var total = 0;
    var discount = 0;

    for (order in finalizedOrders.values()) {
      let orderDay = order.timestamp / dayInNanoseconds;
      if (orderDay == today) {
        itemCount += order.items.size();
        total += order.total;
        discount += order.discount;
      };
    };

    {
      itemCount;
      total;
      discount;
    };
  };

  public query ({ caller }) func getItemWiseSales() : async [(Text, Nat, Nat)] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };
    let salesMap = Map.empty<Text, (Nat, Nat)>();

    for (order in finalizedOrders.values()) {
      for (item in order.items.values()) {
        switch (salesMap.get(item.name)) {
          case (null) {
            salesMap.add(item.name, (item.quantity, item.price * item.quantity));
          };
          case (?(qty, revenue)) {
            salesMap.add(item.name, (qty + item.quantity, revenue + (item.price * item.quantity)));
          };
        };
      };
    };

    let resultArray = salesMap.toArray().map(
      func((name, (qty, revenue))) { (name, qty, revenue) }
    );
    resultArray.sort(
      func((name1, _, _), (name2, _, _)) { Text.compare(name1, name2) }
    );
  };

  public query ({ caller }) func getDateWiseSalesHistory(startDate : Int, endDate : Int) : async [FinalizedOrder] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };
    finalizedOrders.toArray().filter(
      func(order) {
        order.timestamp >= startDate and order.timestamp <= endDate
      }
    ).sort();
  };

  // New method to retrieve orders by a specific date range
  public query ({ caller }) func getTodaySales(startTimestamp : Int, endTimestamp : Int) : async [FinalizedOrder] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access this method");
    };

    let filteredOrders = finalizedOrders.toArray().filter(
      func(order) {
        order.timestamp >= startTimestamp and order.timestamp <= endTimestamp
      }
    );

    filteredOrders.sort();
  };

  // New backend query for day-wise total sales
  public query ({ caller }) func getDayWiseTotalSales(startDate : ?Int, endDate : ?Int) : async [DailySales] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };

    // Use provided date range or default to cover all records
    let start : Int = switch (startDate) {
      case (?d) { d };
      case (null) { intMinValue };
    };
    let end : Int = switch (endDate) {
      case (?d) { d };
      case (null) { intMaxValue };
    };

    let salesMap = Map.empty<Int, Nat>();

    func updateSalesMap(timestamp : Int, total : Nat) {
      let day = timestamp / dayInNanoseconds;
      let existingTotal = switch (salesMap.get(day)) {
        case (?oldTotal) { oldTotal };
        case (null) { 0 };
      };
      salesMap.add(day, existingTotal + total);
    };

    for (order in finalizedOrders.values()) {
      if (order.timestamp >= start and order.timestamp <= end) {
        updateSalesMap(order.timestamp, order.total);
      };
    };

    salesMap.toArray().map(
      func((date, totalSales)) { { date; totalSales } }
    );
  };

  // New backend query for monthly total sales
  public query ({ caller }) func getMonthlyTotalSales() : async [(Int, Nat)] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };

    let salesMap = Map.empty<Int, Nat>();
    let daysInMonth = 30;

    func updateSalesMap(timestamp : Int, total : Nat) {
      let month = timestamp / (daysInMonth * dayInNanoseconds);
      let existingTotal = switch (salesMap.get(month)) {
        case (?oldTotal) { oldTotal };
        case (null) { 0 };
      };
      salesMap.add(month, existingTotal + total);
    };

    for (order in finalizedOrders.values()) {
      updateSalesMap(order.timestamp, order.total);
    };

    salesMap.toArray();
  };

  public query ({ caller }) func getPreviousDaySales() : async ?PreviousDaySales {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };

    let currentTimeStamp = 0; // Placeholder for current time
    let today = currentTimeStamp / dayInNanoseconds;
    let previousDay = today - 1;

    var totalRevenue = 0;
    var totalBills = 0;

    for (order in finalizedOrders.values()) {
      let orderDay = order.timestamp / dayInNanoseconds;
      if (orderDay == previousDay) {
        totalRevenue += order.total;
        totalBills += 1;
      };
    };

    if (totalBills == 0) { null } else {
      ?{ totalRevenue; totalBills };
    };
  };

  public shared ({ caller }) func clearActiveOrders() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can clear active orders");
    };
    orders.clear();
  };

  // Clear all persisted state - Admin only
  public shared ({ caller }) func clearAllState() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can clear all state");
    };
    menuItems.clear();
    orders.clear();
    finalizedOrders.clear();
    userProfiles.clear();
    nextOrderId := 1;
    nextFinalizedOrderId := 1;
  };
};
