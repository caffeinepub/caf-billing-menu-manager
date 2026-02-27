import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Text "mo:core/Text";

module {
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

  type Actor = {
    menuItems : Map.Map<Nat, MenuItem>;
    categories : Map.Map<Text, Category>;
    userProfiles : Map.Map<Principal, UserProfile>;
    finalizedOrders : List.List<FinalizedOrder>;
    nextOrderId : Nat;
    nextFinalizedOrderId : Nat;
    dayInNanoseconds : Int;
    intMinValue : Int;
    intMaxValue : Int;
    menuData : [{ name : Text; price : Nat; category : Text }];
  };

  public func run(oldActor : Actor) : Actor {
    oldActor;
  };
};

