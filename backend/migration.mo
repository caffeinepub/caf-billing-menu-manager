import Map "mo:core/Map";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";

module {
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

  // Persistent state
  public type State = {
    var menuItems : Map.Map<Nat, MenuItem>;
    var orders : List.List<Order>;
    var finalizedOrders : List.List<FinalizedOrder>;
    userProfiles : Map.Map<Principal, UserProfile>;
    var nextOrderId : Nat;
    var nextFinalizedOrderId : Nat;
  };

  public func run(_ : State) : State {
    {
      var menuItems = Map.fromIter<Nat, MenuItem>(getInitializedMenuItems().entries());
      var orders = List.empty<Order>();
      var finalizedOrders = List.empty<FinalizedOrder>();
      userProfiles = Map.empty<Principal, UserProfile>();
      var nextOrderId = 1;
      var nextFinalizedOrderId = 1;
    };
  };

  func getInitializedMenuItems() : Map.Map<Nat, MenuItem> {
    let items = [
      // Tea (Non-Alcoholic Beverages)
      { id = 1; name = "Normal Tea"; price = 20; category = "Tea (Non-Alcoholic Beverages)" },
      { id = 2; name = "Masala Tea"; price = 25; category = "Tea (Non-Alcoholic Beverages)" },
      { id = 3; name = "Ginger Tea"; price = 25; category = "Tea (Non-Alcoholic Beverages)" },
      { id = 4; name = "Elaichi Tea"; price = 25; category = "Tea (Non-Alcoholic Beverages)" },
      { id = 5; name = "Kesar Tea"; price = 40; category = "Tea (Non-Alcoholic Beverages)" },
      { id = 6; name = "Malai Tea"; price = 30; category = "Tea (Non-Alcoholic Beverages)" },
      { id = 7; name = "Green Tea"; price = 30; category = "Tea (Non-Alcoholic Beverages)" },
      { id = 8; name = "Black Tea"; price = 20; category = "Tea (Non-Alcoholic Beverages)" },
      { id = 9; name = "Lemon Tea"; price = 20; category = "Tea (Non-Alcoholic Beverages)" },
      { id = 10; name = "Darjeeling Tea"; price = 35; category = "Tea (Non-Alcoholic Beverages)" },
      { id = 11; name = "Lemon Iced Tea (300 ML)"; price = 60; category = "Tea (Non-Alcoholic Beverages)" },

      // Coffee (Non-Alcoholic Beverages)
      { id = 12; name = "Milk Coffee"; price = 40; category = "Coffee (Non-Alcoholic Beverages)" },
      { id = 13; name = "Cappuccino"; price = 60; category = "Coffee (Non-Alcoholic Beverages)" },
      { id = 14; name = "Americano"; price = 50; category = "Coffee (Non-Alcoholic Beverages)" },
      { id = 15; name = "Iced Americano"; price = 70; category = "Coffee (Non-Alcoholic Beverages)" },
      { id = 16; name = "Cold Coffee"; price = 70; category = "Coffee (Non-Alcoholic Beverages)" },

      // Sandwich
      { id = 17; name = "Veg Sandwich"; price = 60; category = "Sandwich" },
      { id = 18; name = "Cheese Corn Sandwich"; price = 85; category = "Sandwich" },
      { id = 19; name = "Paneer Sandwich"; price = 100; category = "Sandwich" },
      { id = 20; name = "Double Jumbo Sandwich"; price = 120; category = "Sandwich" },

      // Toast
      { id = 21; name = "Butter Toast"; price = 40; category = "Toast" },
      { id = 22; name = "Peri Peri Toast"; price = 50; category = "Toast" },
      { id = 23; name = "Jam Toast"; price = 40; category = "Toast" },
      { id = 24; name = "Malai Toast"; price = 50; category = "Toast" },

      // Light Snacks
      { id = 25; name = "Wai Wai (Soup)"; price = 45; category = "Light Snacks" },
      { id = 26; name = "Wai Wai (Dry)"; price = 45; category = "Light Snacks" },
      { id = 27; name = "Maggi (Soup)"; price = 45; category = "Light Snacks" },
      { id = 28; name = "Maggi (Dry)"; price = 45; category = "Light Snacks" },
      { id = 29; name = "Butter Maggi"; price = 55; category = "Light Snacks" },
      { id = 30; name = "Vegetables Maggi"; price = 60; category = "Light Snacks" },
      { id = 31; name = "Cheese Maggi"; price = 65; category = "Light Snacks" },
      { id = 32; name = "Corn Maggi"; price = 70; category = "Light Snacks" },
      { id = 33; name = "Cheese Corn Maggi"; price = 75; category = "Light Snacks" },
      { id = 34; name = "Pasta (Red)"; price = 85; category = "Light Snacks" },
      { id = 35; name = "Pasta (White)"; price = 85; category = "Light Snacks" },

      // Momos
      { id = 36; name = "Veg Momo (Steam – 8 pcs)"; price = 50; category = "Momo" },
      { id = 37; name = "Veg Momo (Fry – 6 pcs)"; price = 60; category = "Momo" },
      { id = 38; name = "Cheese Momo (Steam – 8 pcs)"; price = 70; category = "Momo" },
      { id = 39; name = "Cheese Momo (Fry – 6 pcs)"; price = 80; category = "Momo" },
      { id = 40; name = "Corn Cheese Momo (Steam – 8 pcs)"; price = 80; category = "Momo" },
      { id = 41; name = "Corn Cheese Momo (Fry – 6 pcs)"; price = 90; category = "Momo" },
      { id = 42; name = "Paneer Momo (Steam – 8 pcs)"; price = 90; category = "Momo" },
      { id = 43; name = "Paneer Momo (Fry – 6 pcs)"; price = 100; category = "Momo" },
      { id = 44; name = "Kurkure Momo"; price = 80; category = "Momo" },
      { id = 45; name = "Chilli Momo"; price = 80; category = "Momo" },

      // Burgers
      { id = 46; name = "Veg Burger"; price = 60; category = "Burger" },
      { id = 47; name = "Cheese Burger"; price = 70; category = "Burger" },
      { id = 48; name = "Paneer Burger"; price = 90; category = "Burger" },

      // Starters
      { id = 49; name = "French Fries"; price = 70; category = "Starter" },
      { id = 50; name = "Peri Peri Fries"; price = 85; category = "Starter" },
      { id = 51; name = "American Corn"; price = 80; category = "Starter" },
      { id = 52; name = "Chilli Potato"; price = 90; category = "Starter" },
      { id = 53; name = "Baby Corn Chilli"; price = 100; category = "Starter" },
      { id = 54; name = "Paneer Pakora (6 pcs)"; price = 90; category = "Starter" },
      { id = 55; name = "Smileys (6 pcs)"; price = 75; category = "Starter" },
      { id = 56; name = "Potato Cheese Shots (7 pcs)"; price = 70; category = "Starter" },

      // Refreshers
      { id = 57; name = "Masala Coke"; price = 50; category = "Refresher" },
      { id = 58; name = "Fresh Lime Soda"; price = 50; category = "Refresher" },
      { id = 59; name = "Mojito"; price = 75; category = "Refresher" },

      // Combo
      { id = 60; name = "Masala / Ginger Tea + Butter Toast"; price = 55; category = "Combo" },
      { id = 61; name = "Normal Tea + Malai Toast"; price = 65; category = "Combo" },
      { id = 62; name = "Veg Sandwich + Normal Tea"; price = 75; category = "Combo" },
      { id = 63; name = "Maggi + Milk Coffee"; price = 80; category = "Combo" },
      { id = 64; name = "French Fries + Cold Coffee"; price = 135; category = "Combo" },
      { id = 65; name = "Corn Cheese Sandwich + Cold Coffee"; price = 150; category = "Combo" },
      { id = 66; name = "Veg Momo + Lemon Iced Tea"; price = 105; category = "Combo" },
      { id = 67; name = "Paneer Pakora (6 pcs) + Masala Tea"; price = 110; category = "Combo" },
      { id = 68; name = "Pasta + Cold Coffee"; price = 150; category = "Combo" },
      { id = 69; name = "Veg Burger + Smileys (6 pcs) + Tea"; price = 140; category = "Combo" },
      { id = 70; name = "Chilli Potato + Green Tea"; price = 115; category = "Combo" },
      { id = 71; name = "Paneer Sandwich + Peri Peri Fries"; price = 180; category = "Combo" },
      { id = 72; name = "Cheese Burger + Peri Peri Fries + Cold Coffee"; price = 210; category = "Combo" },
    ];

    Map.fromIter<Nat, MenuItem>(
      items.map(func(item) { (item.id, item) }).values()
    );
  };
};
