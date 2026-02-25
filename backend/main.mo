import Map "mo:core/Map";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import CoreOrder "mo:core/Order";
import Iter "mo:core/Iter";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Migration "migration";

(with migration = Migration.run)
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
    discount : Nat;
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

  let menuItems = Map.empty<Nat, MenuItem>();
  let orders = List.empty<Order>();

  let dayInNanoseconds : Int = 24 * 60 * 60 * 1000000000;

  // Helper function to populate the menu if empty
  func initializeMenu() {
    if (menuItems.isEmpty()) {
      let defaultMenu : [(Nat, MenuItem)] = [
        (1, {
          id = 1;
          name = "Normal Tea";
          price = 20;
          category = "Tea";
        }),
        (2, {
          id = 2;
          name = "Masala Tea";
          price = 25;
          category = "Tea";
        }),
        (3, {
          id = 3;
          name = "Ginger Tea";
          price = 25;
          category = "Tea";
        }),
        (4, {
          id = 4;
          name = "Elaichi Tea";
          price = 25;
          category = "Tea";
        }),
        (5, {
          id = 5;
          name = "Kesar Tea";
          price = 40;
          category = "Tea";
        }),
        (6, {
          id = 6;
          name = "Malai Tea";
          price = 30;
          category = "Tea";
        }),
        (7, {
          id = 7;
          name = "Green Tea";
          price = 30;
          category = "Tea";
        }),
        (8, {
          id = 8;
          name = "Black Tea";
          price = 20;
          category = "Tea";
        }),
        (9, {
          id = 9;
          name = "Lemon Tea";
          price = 20;
          category = "Tea";
        }),
        (10, {
          id = 10;
          name = "Darjeeling Tea";
          price = 35;
          category = "Tea";
        }),
        (11, {
          id = 11;
          name = "Lemon Iced Tea (300 ML)";
          price = 60;
          category = "Tea";
        }),
        (12, {
          id = 12;
          name = "Milk Coffee";
          price = 40;
          category = "Coffee";
        }),
        (13, {
          id = 13;
          name = "Cappuccino";
          price = 60;
          category = "Coffee";
        }),
        (14, {
          id = 14;
          name = "Americano";
          price = 50;
          category = "Coffee";
        }),
        (15, {
          id = 15;
          name = "Iced Americano";
          price = 70;
          category = "Coffee";
        }),
        (16, {
          id = 16;
          name = "Cold Coffee";
          price = 70;
          category = "Coffee";
        }),
        (17, {
          id = 17;
          name = "Veg Sandwich";
          price = 60;
          category = "Sandwich";
        }),
        (18, {
          id = 18;
          name = "Cheese Corn Sandwich";
          price = 85;
          category = "Sandwich";
        }),
        (19, {
          id = 19;
          name = "Paneer Sandwich";
          price = 100;
          category = "Sandwich";
        }),
        (20, {
          id = 20;
          name = "Double Jumbo Sandwich";
          price = 120;
          category = "Sandwich";
        }),
        (21, {
          id = 21;
          name = "Butter Toast";
          price = 40;
          category = "Toast";
        }),
        (22, {
          id = 22;
          name = "Peri Peri Toast";
          price = 50;
          category = "Toast";
        }),
        (23, {
          id = 23;
          name = "Jam Toast";
          price = 40;
          category = "Toast";
        }),
        (24, {
          id = 24;
          name = "Malai Toast";
          price = 50;
          category = "Toast";
        }),
        (25, {
          id = 25;
          name = "Wai Wai (Soup)";
          price = 45;
          category = "Light Snacks";
        }),
        (26, {
          id = 26;
          name = "Wai Wai (Dry)";
          price = 45;
          category = "Light Snacks";
        }),
        (27, {
          id = 27;
          name = "Maggi (Soup)";
          price = 45;
          category = "Light Snacks";
        }),
        (28, {
          id = 28;
          name = "Maggi (Dry)";
          price = 45;
          category = "Light Snacks";
        }),
        (29, {
          id = 29;
          name = "Butter Maggi";
          price = 55;
          category = "Light Snacks";
        }),
        (30, {
          id = 30;
          name = "Vegetables Maggi";
          price = 60;
          category = "Light Snacks";
        }),
        (31, {
          id = 31;
          name = "Cheese Maggi";
          price = 65;
          category = "Light Snacks";
        }),
        (32, {
          id = 32;
          name = "Corn Maggi";
          price = 70;
          category = "Light Snacks";
        }),
        (33, {
          id = 33;
          name = "Cheese Corn Maggi";
          price = 75;
          category = "Light Snacks";
        }),
        (34, {
          id = 34;
          name = "Pasta (Red)";
          price = 85;
          category = "Light Snacks";
        }),
        (35, {
          id = 35;
          name = "Pasta (White)";
          price = 85;
          category = "Light Snacks";
        }),
        (36, {
          id = 36;
          name = "Veg Momo (Steam – 8 pcs)";
          price = 50;
          category = "Momos";
        }),
        (37, {
          id = 37;
          name = "Veg Momo (Fry – 6 pcs)";
          price = 60;
          category = "Momos";
        }),
        (38, {
          id = 38;
          name = "Cheese Momo (Steam – 8 pcs)";
          price = 70;
          category = "Momos";
        }),
        (39, {
          id = 39;
          name = "Cheese Momo (Fry – 6 pcs)";
          price = 80;
          category = "Momos";
        }),
        (40, {
          id = 40;
          name = "Corn Cheese Momo (Steam – 8 pcs)";
          price = 80;
          category = "Momos";
        }),
        (41, {
          id = 41;
          name = "Corn Cheese Momo (Fry – 6 pcs)";
          price = 90;
          category = "Momos";
        }),
        (42, {
          id = 42;
          name = "Paneer Momo (Steam – 8 pcs)";
          price = 90;
          category = "Momos";
        }),
        (43, {
          id = 43;
          name = "Paneer Momo (Fry – 6 pcs)";
          price = 100;
          category = "Momos";
        }),
        (44, {
          id = 44;
          name = "Kurkure Momo";
          price = 80;
          category = "Momos";
        }),
        (45, {
          id = 45;
          name = "Chilli Momo";
          price = 80;
          category = "Momos";
        }),
        (46, {
          id = 46;
          name = "Veg Burger";
          price = 60;
          category = "Burgers";
        }),
        (47, {
          id = 47;
          name = "Cheese Burger";
          price = 70;
          category = "Burgers";
        }),
        (48, {
          id = 48;
          name = "Paneer Burger";
          price = 90;
          category = "Burgers";
        }),
        (49, {
          id = 49;
          name = "French Fries";
          price = 70;
          category = "Starters";
        }),
        (50, {
          id = 50;
          name = "Peri Peri Fries";
          price = 85;
          category = "Starters";
        }),
        (51, {
          id = 51;
          name = "American Corn";
          price = 80;
          category = "Starters";
        }),
        (52, {
          id = 52;
          name = "Chilli Potato";
          price = 90;
          category = "Starters";
        }),
        (53, {
          id = 53;
          name = "Baby Corn Chilli";
          price = 100;
          category = "Starters";
        }),
        (54, {
          id = 54;
          name = "Paneer Pakora (6 pcs)";
          price = 90;
          category = "Starters";
        }),
        (55, {
          id = 55;
          name = "Smileys (6 pcs)";
          price = 75;
          category = "Starters";
        }),
        (56, {
          id = 56;
          name = "Potato Cheese Shots (7 pcs)";
          price = 70;
          category = "Starters";
        }),
        (57, {
          id = 57;
          name = "Masala Coke";
          price = 50;
          category = "Refreshers";
        }),
        (58, {
          id = 58;
          name = "Fresh Lime Soda";
          price = 50;
          category = "Refreshers";
        }),
        (59, {
          id = 59;
          name = "Mojito";
          price = 75;
          category = "Refreshers";
        }),
        (60, {
          id = 60;
          name = "Masala / Ginger Tea + Butter Toast";
          price = 55;
          category = "Combo";
        }),
        (61, {
          id = 61;
          name = "Normal Tea + Malai Toast";
          price = 65;
          category = "Combo";
        }),
        (62, {
          id = 62;
          name = "Veg Sandwich + Normal Tea";
          price = 75;
          category = "Combo";
        }),
        (63, {
          id = 63;
          name = "Maggi + Milk Coffee";
          price = 80;
          category = "Combo";
        }),
        (64, {
          id = 64;
          name = "French Fries + Cold Coffee";
          price = 135;
          category = "Combo";
        }),
        (65, {
          id = 65;
          name = "Corn Cheese Sandwich + Cold Coffee";
          price = 150;
          category = "Combo";
        }),
        (66, {
          id = 66;
          name = "Veg Momo + Lemon Iced Tea";
          price = 105;
          category = "Combo";
        }),
        (67, {
          id = 67;
          name = "Paneer Pakora (6 pcs) + Masala Tea";
          price = 110;
          category = "Combo";
        }),
        (68, {
          id = 68;
          name = "Pasta + Cold Coffee";
          price = 150;
          category = "Combo";
        }),
        (69, {
          id = 69;
          name = "Veg Burger + Smileys (6 pcs) + Tea";
          price = 140;
          category = "Combo";
        }),
        (70, {
          id = 70;
          name = "Chilli Potato + Green Tea";
          price = 115;
          category = "Combo";
        }),
        (71, {
          id = 71;
          name = "Paneer Sandwich + Peri Peri Fries";
          price = 180;
          category = "Combo";
        }),
        (72, {
          id = 72;
          name = "Cheese Burger + Peri Peri Fries + Cold Coffee";
          price = 210;
          category = "Combo";
        }),
      ];

      for ((id, item) in defaultMenu.values()) {
        menuItems.add(id, item);
      };
    };
  };

  // Menu Management
  public shared ({ caller }) func addMenuItem(name : Text, price : Nat, category : Text) : async Nat {
    initializeMenu();
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
    initializeMenu();
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
    initializeMenu();
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

  public query ({ caller }) func getAllMenuItems() : async [MenuItem] {
    initializeMenu();
    menuItems.values().toArray();
  };

  // Order Finalization - Tax No Longer Applied
  public shared ({ caller }) func finalizeOrder(orderItems : [OrderItem], discount : Nat) : async Order {
    let subtotal = orderItems.foldLeft(
      0,
      func(acc, item) {
        acc + (item.price * item.quantity);
      },
    );

    // Calculate final total as subtotal minus discount (no tax)
    let total = if (discount > subtotal) { 0 } else { subtotal - discount };
    let timestamp = 0; // Placeholder value until time support is implemented

    let order : Order = {
      items = orderItems;
      subtotal;
      discount;
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
    discount : Nat;
  } {
    let today = 0 / dayInNanoseconds; // Placeholder value until time support is implemented

    var itemCount = 0;
    var total = 0;
    var discount = 0;

    for (order in orders.values()) {
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
