import Map "mo:core/Map";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import CoreOrder "mo:core/Order";
import Array "mo:core/Array";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";

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
    items : [OrderItem];
    subtotal : Nat;
    tax : Nat;
    total : Nat;
    timestamp : Int;
  };

  module MenuItem {
    public func compare(menuItem1 : MenuItem, menuItem2 : MenuItem) : CoreOrder.Order {
      if (menuItem1.id < menuItem2.id) { #less } else if (menuItem1.id == menuItem2.id) { #equal } else {
        #greater;
      };
    };

    public func compareByCategory(menuItem1 : MenuItem, menuItem2 : MenuItem) : CoreOrder.Order {
      switch (Text.compare(menuItem1.category, menuItem2.category)) {
        case (#equal) { if (menuItem1.id < menuItem2.id) { #less } else if (menuItem1.id == menuItem2.id) { #equal } else {
            #greater;
          }
        };
        case (order) { order };
      };
    };
  };

  module Order {
    public func compare(order1 : Order, order2 : Order) : CoreOrder.Order {
      if (order1.timestamp < order2.timestamp) { #less } else if (order1.timestamp == order2.timestamp) { #equal } else {
        #greater;
      };
    };
  };

  // Store menu items and orders in persistent Map structures
  let menuItems = Map.empty<Nat, MenuItem>();
  let orders = List.empty<Order>();

  // Tax rate as a percentage (e.g., 5%)
  let taxRate = 5;

  // Constant for one day in nanoseconds
  let dayInNanoseconds : Int = 24 * 60 * 60 * 1000000000;

  // Menu Management
  public shared ({ caller }) func addMenuItem(name : Text, price : Nat, category : Text) : async Nat {
    let id = menuItems.size();
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
    if (not menuItems.containsKey(id)) {
      Runtime.trap("Menu item not found");
    };
    menuItems.remove(id);
  };

  public query ({ caller }) func getMenuItemsByCategory() : async [(Text, [MenuItem])] {
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

    categoryMap.toArray().sort(func((cat1, _), (cat2, _)) { Text.compare(cat1, cat2) });
  };

  // Finalize Order & Print Bill
  public shared ({ caller }) func finalizeOrder(orderItems : [OrderItem]) : async Order {
    let subtotal = orderItems.foldLeft(
      0,
      func(acc, item) {
        acc + (item.price * item.quantity);
      },
    );

    let tax = (subtotal * taxRate) / 100;
    let total = subtotal + tax;
    let timestamp = 0; // Placeholder value until time support is implemented

    let order : Order = {
      items = orderItems;
      subtotal;
      tax;
      total;
      timestamp;
    };

    orders.add(order);
    order;
  };

  // Sales Reports
  public query ({ caller }) func getDailySalesSummary() : async {
    itemCount : Nat;
    total : Nat;
    tax : Nat;
  } {
    let today = 0 / dayInNanoseconds; // Placeholder value until time support is implemented

    var itemCount = 0;
    var total = 0;
    var tax = 0;

    for (order in orders.values()) {
      let orderDay = order.timestamp / dayInNanoseconds;
      if (orderDay == today) {
        itemCount += order.items.size();
        total += order.total;
        tax += order.tax;
      };
    };

    {
      itemCount;
      total;
      tax;
    };
  };

  public query ({ caller }) func getItemWiseSales() : async [(Text, Nat, Nat)] {
    let salesMap = Map.empty<Text, (Nat, Nat)>();

    for (order in orders.values()) {
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

  public query ({ caller }) func getDateWiseSalesHistory(startDate : Int, endDate : Int) : async [Order] {
    orders.toArray().filter(
      func(order) {
        order.timestamp >= startDate and order.timestamp <= endDate
      }
    ).sort();
  };
};
