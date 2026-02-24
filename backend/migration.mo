import Map "mo:core/Map";
import List "mo:core/List";
import Nat "mo:core/Nat";

module {
  type MenuItem = {
    id : Nat;
    name : Text;
    price : Nat;
    category : Text;
  };

  type Order = {
    items : [OrderItem];
    subtotal : Nat;
    discount : Nat;
    total : Nat;
    timestamp : Int;
  };

  type OrderItem = {
    menuItemId : Nat;
    name : Text;
    quantity : Nat;
    price : Nat;
  };

  type OldActor = {
    menuItems : Map.Map<Nat, MenuItem>;
    orders : List.List<Order>;
  };

  type NewActor = {
    menuItems : Map.Map<Nat, MenuItem>;
    orders : List.List<Order>;
  };

  public func run(old : OldActor) : NewActor {
    { old with orders = List.empty() };
  };
};
