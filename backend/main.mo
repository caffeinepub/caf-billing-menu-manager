import Map "mo:core/Map";
import List "mo:core/List";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Int "mo:core/Int";
import Iter "mo:core/Iter";

import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Migration "migration";

// Persisted State

(with migration = Migration.run)
actor {
  type MenuItem = {
    id : Nat;
    name : Text;
    price : Nat;
    category : Text;
  };

  type Category = {
    name : Text;
  };

  type OrderItem = {
    menuItemId : Nat;
    name : Text;
    quantity : Nat;
    price : Nat;
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

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Persistent state
  let menuItems = Map.empty<Nat, MenuItem>();
  let categories = Map.empty<Text, Category>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  var finalizedOrders : List.List<FinalizedOrder> = List.empty<FinalizedOrder>();
  var nextOrderId = 1;
  var nextFinalizedOrderId = 1;
  let dayInNanoseconds : Int = 24 * 60 * 60 * 1000000000;
  let intMinValue : Int = -9223372036854775808;
  let intMaxValue : Int = 9223372036854775807;

  // Menu Data (persistent type)
  let menuData : [{ name : Text; price : Nat; category : Text }] = [
    { name = "Small Tea"; price = 1000; category = "Tea" },
    { name = "Normal Tea"; price = 2000; category = "Tea" },
    { name = "Masala Tea"; price = 2500; category = "Tea" },
    { name = "Ginger Tea"; price = 2500; category = "Tea" },
    { name = "Elaichi Tea"; price = 2500; category = "Tea" },
    { name = "Kesar Tea"; price = 4000; category = "Tea" },
    { name = "Malai Tea"; price = 3000; category = "Tea" },
    { name = "Green Tea"; price = 3000; category = "Tea" },
    { name = "Black Tea"; price = 2000; category = "Tea" },
    { name = "Lemon Tea"; price = 2000; category = "Tea" },
    { name = "Darjeeling Tea"; price = 3500; category = "Tea" },
    { name = "Lemon Iced Tea (300 ML)"; price = 6000; category = "Tea" },
    { name = "Milk Coffee"; price = 4000; category = "Coffee" },
    { name = "Cappuccino"; price = 6000; category = "Coffee" },
    { name = "Americano"; price = 5000; category = "Coffee" },
    { name = "Iced Americano"; price = 7000; category = "Coffee" },
    { name = "Cold Coffee"; price = 7000; category = "Coffee" },
    { name = "Veg Sandwich"; price = 6000; category = "Sandwich" },
    { name = "Cheese Corn Sandwich"; price = 8500; category = "Sandwich" },
    { name = "Paneer Sandwich"; price = 10000; category = "Sandwich" },
    { name = "Double Jumbo Sandwich"; price = 12000; category = "Sandwich" },
    { name = "Butter Toast"; price = 4000; category = "Toast" },
    { name = "Peri Peri Toast"; price = 5000; category = "Toast" },
    { name = "Jam Toast"; price = 4000; category = "Toast" },
    { name = "Malai Toast"; price = 5000; category = "Toast" },
    { name = "Wai Wai (Soup)"; price = 4500; category = "Light Snacks" },
    { name = "Wai Wai (Dry)"; price = 4500; category = "Light Snacks" },
    { name = "Maggi (Soup)"; price = 4500; category = "Light Snacks" },
    { name = "Maggi (Dry)"; price = 4500; category = "Light Snacks" },
    { name = "Butter Maggi"; price = 5500; category = "Light Snacks" },
    { name = "Vegetables Maggi"; price = 6000; category = "Light Snacks" },
    { name = "Cheese Maggi"; price = 6500; category = "Light Snacks" },
    { name = "Corn Maggi"; price = 7000; category = "Light Snacks" },
    { name = "Cheese Corn Maggi"; price = 7500; category = "Light Snacks" },
    { name = "Pasta (Red)"; price = 8500; category = "Light Snacks" },
    { name = "Pasta (White)"; price = 8500; category = "Light Snacks" },
    { name = "Veg Momo (Steam - 8 pcs)"; price = 5000; category = "Momos" },
    { name = "Veg Momo (Fry - 6 pcs)"; price = 6000; category = "Momos" },
    { name = "Cheese Momo (Steam - 8 pcs)"; price = 7000; category = "Momos" },
    { name = "Cheese Momo (Fry - 6 pcs)"; price = 8000; category = "Momos" },
    { name = "Corn Cheese Momo (Steam - 8 pcs)"; price = 8000; category = "Momos" },
    { name = "Corn Cheese Momo (Fry - 6 pcs)"; price = 9000; category = "Momos" },
    { name = "Paneer Momo (Steam - 8 pcs)"; price = 9000; category = "Momos" },
    { name = "Paneer Momo (Fry - 6 pcs)"; price = 10000; category = "Momos" },
    { name = "Kurkure Momo"; price = 8000; category = "Momos" },
    { name = "Chilli Momo"; price = 8000; category = "Momos" },
    { name = "Veg Burger"; price = 6000; category = "Burgers" },
    { name = "Cheese Burger"; price = 7000; category = "Burgers" },
    { name = "Paneer Burger"; price = 9000; category = "Burgers" },
    { name = "French Fries"; price = 7000; category = "Starters" },
    { name = "Peri Peri Fries"; price = 8500; category = "Starters" },
    { name = "American Corn"; price = 8000; category = "Starters" },
    { name = "Chilli Potato"; price = 9000; category = "Starters" },
    { name = "Baby Corn Chilli"; price = 10000; category = "Starters" },
    { name = "Paneer Pakora (6 pcs)"; price = 9000; category = "Starters" },
    { name = "Smileys (6 pcs)"; price = 7500; category = "Starters" },
    { name = "Potato Cheese Shots (7 pcs)"; price = 7000; category = "Starters" },
    { name = "Masala Coke"; price = 5000; category = "Refreshers" },
    { name = "Fresh Lime Soda"; price = 5000; category = "Refreshers" },
    { name = "Mojito"; price = 7500; category = "Refreshers" },
    { name = "Water (500 ML)"; price = 1000; category = "Beverages" },
    { name = "Water (1 Litre)"; price = 2000; category = "Beverages" },
    { name = "Water (2 Litre)"; price = 3000; category = "Beverages" },
    { name = "Soft Drink"; price = 4000; category = "Beverages" },
    { name = "Masala / Ginger Tea + Butter Toast"; price = 5500; category = "Combo" },
    { name = "Normal Tea + Malai Toast"; price = 6500; category = "Combo" },
    { name = "Veg Sandwich + Normal Tea"; price = 7500; category = "Combo" },
    { name = "Maggi + Milk Coffee"; price = 8000; category = "Combo" },
    { name = "French Fries + Cold Coffee"; price = 13500; category = "Combo" },
    { name = "Corn Cheese Sandwich + Cold Coffee"; price = 15000; category = "Combo" },
    { name = "Veg Momo + Lemon Iced Tea"; price = 10500; category = "Combo" },
    { name = "Paneer Pakora (6 pcs) + Masala Tea"; price = 11000; category = "Combo" },
    { name = "Pasta + Cold Coffee"; price = 15000; category = "Combo" },
    { name = "Veg Burger + Smileys (6 pcs) + Tea"; price = 14000; category = "Combo" },
    { name = "Chilli Potato + Green Tea"; price = 11500; category = "Combo" },
    { name = "Paneer Sandwich + Peri Peri Fries"; price = 18000; category = "Combo" },
    { name = "Cheese Burger + Peri Peri Fries + Cold Coffee"; price = 21000; category = "Combo" },
  ];

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get their profile");
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

  // Menu Queries
  public query ({ caller }) func getCategories() : async [Category] {
    categories.values().toArray();
  };

  public query ({ caller }) func getAllMenuItems() : async [MenuItem] {
    menuItems.values().toArray();
  };

  public query ({ caller }) func getMenuItemsByCategory(category : Text) : async [MenuItem] {
    menuItems.values().toArray().filter(
      func(item) {
        Text.equal(item.category, category);
      }
    );
  };

  // Persist and retrieve finalized orders
  public query ({ caller }) func getFinalizedOrders() : async [FinalizedOrder] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view finalized orders");
    };
    finalizedOrders.toArray();
  };

  public shared ({ caller }) func saveFinalizedOrder(order : FinalizedOrder) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save finalized orders");
    };
    finalizedOrders.add(order);
  };

  public shared ({ caller }) func clearAllFinalizedOrders() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can clear finalized orders");
    };
    finalizedOrders.clear();
  };

  // New function to clear all persistent state (admin only)
  public shared ({ caller }) func clearAllData() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can clear all data");
    };
    menuItems.clear();
    categories.clear();
    userProfiles.clear();
    finalizedOrders.clear();
    nextOrderId := 1;
    nextFinalizedOrderId := 1;
  };
};

