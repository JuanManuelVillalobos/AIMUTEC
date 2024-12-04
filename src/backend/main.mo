import Map "mo:base/HashMap";
import Text "mo:base/Text";

actor DocumentApproval {
  
  type Status = {
    #Pending;
    #Approved;
    #Denied;
  };

  private let documents = Map.HashMap<Text, Status>(10, Text.equal, Text.hash);

  public func addDocument(id : Text) : async () {
    documents.put(id, #Pending);
  };

  public func approveDocument(id : Text) : async () {
    documents.put(id, #Approved);
  };

  public func denyDocument(id : Text) : async () {
    documents.put(id, #Denied);
  };

  public query func getStatus(id : Text) : async ?Status {
    documents.get(id)
  };
};