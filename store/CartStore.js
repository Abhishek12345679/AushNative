import { flow, types } from "mobx-state-tree";

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
    setExtra(age) {
      // fetch(
      //   `https://chemy-llc.firebaseio.com/extra/${self.userCredentials.uid}.json?auth=${self.userCredentials.token}`,
      //   {
      //     method: "PATCH",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify({ age }),
      //   }
      // )
      //   .then((res) => res.json())
      //   .then((data) => console.log(data))
      //   .catch((err) => console.log(err));
    },
    getExtra: flow(function* getExtra() {
      // try {
      //   const response = yield fetch(
      //     `https://chemy-llc.firebaseio.com/extra/${self.userCredentials.uid}.json?auth=${self.userCredentials.token}`
      //   );
      //   const resData = yield response.json();
      //   console.log(resData);
      //   DrugStore.setPFP(resData.image);
      //   if (resData) {
      //     self.profile.display_picture = resData.image;
      //     self.profile.dob = resData.age * 365 * 24 * 3600;
      //     return resData;
      //   }
      // } catch (e) {
      //   console.log(e);
      // }
    }),
  }))
  // Authentication
  .actions((self) => ({
    setAuthState(status) {
      self.isAuthenticated = status;
    },
    setDidTryAutoLogin() {
      self.didTryAutoLogin = true;
    },
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
    addOrder(order) {
      self.order = order;
    },
    updateStatus(status) {
      self.order.status = status;
    },
    addOrder(order) {
      // console.log(self.userCredentials);
      // const response = fetch(
      //   `https://chemy-llc.firebaseio.com/orders/${self.userCredentials.uid}.json?auth=${self.userCredentials.token}`,
      //   {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify(order),
      //   }
      // )
      //   .then((res) => res)
      //   // .then((data) => {
      //   //   if (data) data.name;
      //   // })
      //   .catch((err) => console.log(err));
      // // console.log(response);
      // return response;
    },
    fetchOrders: flow(function* fetchOrders() {
      // try {
      //   const response = yield fetch(
      //     `https://chemy-llc.firebaseio.com/orders/${self.userCredentials.uid}.json?auth=${self.userCredentials.token}`
      //   );
      //   const resData = yield response.json();
      //   let loadedData = [];
      //   for (const key in resData) {
      //     // console.log("Key", key);
      //     // console.log(orders[key].items);
      //     loadedData.push(resData[key]);
      //   }
      //   // console.log(loadedData);
      //   self.orders = loadedData;
      //   console.log(loadedData);
      // } catch (e) {
      //   console.log(e);
      //   // if (e === "Auth token is expired") {
      //   //   console.log("LOGOUT");
      //   // }
      //   // console.log(e);
      // }
    }),
  }))
  // Address Actions
  .actions((self) => ({
    addNewAddress(address) {
      // self.addresses.push(address);
      // const response = fetch(
      //   `https://chemy-llc.firebaseio.com/addresses/${self.userCredentials.uid}.json?auth=${self.userCredentials.token}`,
      //   {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify(address),
      //   }
      // )
      //   .then((res) => res.json())
      //   .catch((err) => console.log(err));
    },
    fetchAddresses: flow(function* fetchAddresses() {
      // const response = yield fetch(
      //   `https://chemy-llc.firebaseio.com/addresses/${self.userCredentials.uid}.json?auth=${self.userCredentials.token}`
      // );
      // const resData = yield response.json();
      // let adds = [];
      // if (resData)
      //   for (const key in resData) {
      //     adds.push(resData[key]);
      //   }
      // console.log(adds);
      // self.addresses = adds;
    }),
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
