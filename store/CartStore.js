import { types } from "mobx-state-tree";

// Drug Model
const Drug = types.model("Drug", {
  id: types.optional(types.string, ""),
  name: types.optional(types.string, ""),
  salt: types.optional(types.string, ""),
  price: types.optional(types.number, 0),
  quantity: types.optional(types.number, 0),
  prescription_req: false,
  total_amt: types.optional(types.number, 0),
});

// Address Model
const Address = types.model("Address", {
  type: types.optional(types.string, ""),
  name: types.optional(types.string, ""),
  add_line_1: types.optional(types.string, ""),
  add_line_2: types.optional(types.string, ""),
  pincode: types.optional(types.string, ""),
  ph_no: types.optional(types.string, ""),
});

// Profile Model
const Profile = types.model("Profile", {
  display_picture: types.optional(types.string, ""),
  name: types.optional(types.string, "test"),
  dob: types.optional(types.Date, 0),
});

// Order Model
const Order = types.model("Order", {
  items: types.optional(types.array(Drug), []),
  datetimestamp: types.optional(types.number, 0),
  address: types.optional(Address, {}),
  total_amt: types.optional(types.number, 0),
  order_id: types.optional(types.string, ""),
  status: types.optional(types.boolean, false),
  prescription: types.optional(types.string, ""),
});

// User Credentials for re-login auto.
const userCredentials = types.model("userCredentials", {
  token: types.optional(types.string, ""),
  uid: types.optional(types.string, ""),
  email: types.optional(types.string, ""),
});

const Location = types.model("Location", {
  locationShortName: types.optional(types.string, ""),
  latitude: types.optional(types.number, 0),
  longitude: types.optional(types.number, 0),
});

// Main Store
const DrugStore = types
  .model("DrugStore", {
    drugs: types.optional(types.array(Drug), []),
    count: types.optional(types.number, 0),
    orders: types.array(Order),
    profile: types.optional(Profile, {}),
    addresses: types.optional(types.array(Address), []),
    isAuthenticated: types.optional(types.boolean, false),
    userCredentials: types.optional(userCredentials, {}),
    didTryAutoLogin: types.optional(types.boolean, false),
    timer: types.optional(types.number, 0),
    location: types.optional(Location, {}),
  })
  .views((self) => ({
    get getCount() {
      return self.count;
    },
  }))
  // Location
  .actions((self) => ({
    saveLocation(name, lat, long) {
      self.location.locationShortName = name;
      self.location.latitude = lat;
      self.location.longitude = long;
    },
  }))
  // settings action
  .actions((self) => ({
    setName(name) {
      self.profile.name = name;
    },
    setPFP(imageUrl) {
      self.profile.display_picture = imageUrl;
    },
    // add profile data to firebase
  }))
  // Authentication
  .actions((self) => ({
    initializeUserCredentials(token, uid, email) {
      self.userCredentials.token = token;
      self.userCredentials.uid = uid;
      self.userCredentials.email = email;
    },
  }))
  // Cart Actions
  .actions((self) => ({
    addDrug(drug) {
      let total_count = 0;
      let flag = 0;

      self.drugs.forEach((drugItem) => {
        console.log(drug.id === drugItem.id);

        const index = self.drugs.findIndex((x) => x.id === drug.id);
        console.log(index);

        if (drugItem.id === drug.id) {
          self.drugs[0] = {
            id: drugItem.id,
            name: drugItem.name,
            salt: drugItem.salt,
            price: drugItem.price,
            quantity: drugItem.quantity + drug.quantity,
            prescription_req: drugItem.prescription_req,
            total_amt: parseInt(
              (drugItem.total_amt + drug.quantity * drugItem.price).toFixed(2)
            ),
          };
          flag++;
        }
      });

      console.log(self.drugs);

      if (flag === 0) {
        self.drugs.push(drug);
      }

      // self.count = self.drugs;

      for (let i = 0; i < self.drugs.length; i++) {
        total_count += self.drugs[i].quantity;
      }

      self.count = total_count;
    },
    removeFromCart(id) {
      self.drugs.forEach((drug, index) => {
        if (id === drug.id) {
          console.log(index);
          self.count = self.count - drug.quantity;
          self.drugs.splice(index, 1);
          //   console.log(self.drugs);
        }
      });
    },
    clearCart() {
      self.drugs.splice(0);
      self.count = 0;
    },
    addone() {
      self.count = self.count + 1;
    },
  }))
  // Order Actions
  .actions((self) => ({
    // add orders to firestore
    // fetch orders from firestore
    // add new addresses to firestore
    // fetch addresses from firestore
  }))
  // initial State
  .create({
    profile: {
      display_picture: " ",
      name: "",
      dob: new Date(996656400000), // dummy age -> 19
    },
    addresses: [
      {
        type: "Home",
        name: "Abhishek Sah",
        add_line_1: "Jogijhora Barabak",
        add_line_2: "Ethelbari",
        pincode: "735204",
        ph_no: "+917908174073",
      },
    ],
  });

export default DrugStore;
