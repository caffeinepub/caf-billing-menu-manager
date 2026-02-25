module {
  type OldActor = {
    defaultMenu : [(Nat, { id : Nat; name : Text; price : Nat; category : Text })];
  };

  type NewActor = {};

  public func run(_old : OldActor) : NewActor { {} };
};
