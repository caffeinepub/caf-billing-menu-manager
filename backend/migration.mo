import Map "mo:core/Map";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Int "mo:core/Int";

module {
  // Old persistent types with tax field
  type OldOrder = {
    items : [OrderItem];
    subtotal : Nat;
    tax : Nat;
    total : Nat;
    timestamp : Int;
  };

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

  type OldActor = {
    menuItems : Map.Map<Nat, MenuItem>;
    orders : List.List<OldOrder>;
    taxRate : Nat;
    dayInNanoseconds : Int;
  };

  // Updated persistent types without tax field
  type UpdatedOrder = {
    items : [OrderItem];
    subtotal : Nat;
    discount : Nat;
    total : Nat;
    timestamp : Int;
  };

  type UpdatedActor = {
    menuItems : Map.Map<Nat, MenuItem>;
    orders : List.List<UpdatedOrder>;
    dayInNanoseconds : Int;
  };

  // Migration function called by the main actor via with-clause
  public func run(old : OldActor) : UpdatedActor {
    let updatedOrders = old.orders.map<OldOrder, UpdatedOrder>(
      func(oldOrder) {
        { oldOrder with discount = 0; total = oldOrder.subtotal };
      }
    );
    {
      old with
      orders = updatedOrders;
    };
  };
};
