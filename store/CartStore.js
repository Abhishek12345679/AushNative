// FIXME: Add QuantitySelector to change quantity

import { flow, types } from "mobx-state-tree";

// Drug Model
const Drug = types.model("Drug", {
  id: types.string,
  name: types.string,
  salt: types.string,
  price: types.number,
  quantity: types.number,
  prescription_req: false,
  total_amt: types.number,
});

// Address Model
const Address = types.model("Address", {
  type: types.string,
  name: types.string,
  add_line_1: types.string,
  add_line_2: types.string,
  pincode: types.string,
  ph_no: types.string,
});

// Profile Model
const Profile = types.model("Profile", {
  display_picture: types.string,
  name: types.string,
  dob: types.Date,
});

// Order Model
const Order = types.model("Order", {
  items: types.array(Drug),
  datetimestamp: types.number,
  address: Address,
  total_amt: types.number,
  order_id: types.string,
  status: types.boolean,
  prescription: types.string,
});

// User Credentials for re-login auto.
const userCredentials = types.model("userCredentials", {
  token: types.string,
  uid: types.string,
  email: types.string,
});

// Health Conditions

const healthConditions = types.model("healthConditions", {
  allergies: types.boolean,
  diabetes: types.boolean,
  lungdiseases: types.boolean,
  skindiseases: types.boolean,
});

const Location = types.model("Location", {
  // locationObj: types.frozen,
  locationShortName: types.string,
  latitude: types.number,
  longitude: types.number,
});

// Main Store
const DrugStore = types
  .model("DrugStore", {
    drugs: types.array(Drug),
    count: types.number,
    // order: Order,
    orders: types.array(Order),
    profile: Profile,
    addresses: types.array(Address),
    HealthConditions: healthConditions,
    isAuthenticated: types.boolean,
    userCredentials: userCredentials,
    didTryAutoLogin: types.boolean,
    timer: types.number,
    location: Location,
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
  // Auth Actions
  .actions((self) => ({
    updateAuthToken(newToken) {
      self.userCredentials.token = newToken;
    },
    startTimer(timer) {
      // clearTimeout(timer);
      console.log("timer starts");
      self.timer = timer;
    },
    clearTimer() {
      console.log("timer set to null");
      // self.timer = 0;
      clearTimeout(self.timer);
      // console.log("timer", self.timer);
    },
  }))
  //settings action
  .actions((self) => ({
    setName(name) {
      self.profile.name = name;
    },
    setPFP(imageUrl) {
      self.profile.display_picture = imageUrl;
    },
    setExtra(age) {
      const response = fetch(
        `https://chemy-llc.firebaseio.com/extra/${self.userCredentials.uid}.json?auth=${self.userCredentials.token}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ age }),
        }
      )
        .then((res) => res.json())
        .then((data) => console.log(data))
        .catch((err) => console.log(err));
    },
    getExtra: flow(function* getExtra() {
      try {
        const response = yield fetch(
          `https://chemy-llc.firebaseio.com/extra/${self.userCredentials.uid}.json?auth=${self.userCredentials.token}`
        );

        const resData = yield response.json();
        console.log(resData);
        DrugStore.setPFP(resData.image);
        if (resData) {
          self.profile.display_picture = resData.image;
          self.profile.dob = resData.age * 365 * 24 * 3600;
          return resData;
        }
      } catch (e) {
        console.log(e);
      }
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
    // addOrder(order) {
    //   self.order = order;
    // },
    // updateStatus(status) {
    //   self.order.status = status;
    // },
    addOrder(order) {
      // console.log(self.userCredentials);
      const response = fetch(
        `https://chemy-llc.firebaseio.com/orders/${self.userCredentials.uid}.json?auth=${self.userCredentials.token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(order),
        }
      )
        .then((res) => res)
        // .then((data) => {
        //   if (data) data.name;
        // })
        .catch((err) => console.log(err));

      // console.log(response);
      return response;
    },
    fetchOrders: flow(function* fetchOrders() {
      try {
        const response = yield fetch(
          `https://chemy-llc.firebaseio.com/orders/${self.userCredentials.uid}.json?auth=${self.userCredentials.token}`
        );

        const resData = yield response.json();

        let loadedData = [];

        for (const key in resData) {
          // console.log("Key", key);
          // console.log(orders[key].items);
          loadedData.push(resData[key]);
        }

        // console.log(loadedData);
        self.orders = loadedData;

        console.log(loadedData);
      } catch (e) {
        console.log(e);
        // if (e === "Auth token is expired") {
        //   console.log("LOGOUT");
        // }
        // console.log(e);
      }
    }),
  }))
  // Address Actions
  .actions((self) => ({
    addNewAddress(address) {
      // self.addresses.push(address);
      const response = fetch(
        `https://chemy-llc.firebaseio.com/addresses/${self.userCredentials.uid}.json?auth=${self.userCredentials.token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(address),
        }
      )
        .then((res) => res.json())
        .catch((err) => console.log(err));
    },
    fetchAddresses: flow(function* fetchAddresses() {
      const response = yield fetch(
        `https://chemy-llc.firebaseio.com/addresses/${self.userCredentials.uid}.json?auth=${self.userCredentials.token}`
      );
      const resData = yield response.json();

      let adds = [];
      if (resData)
        for (const key in resData) {
          adds.push(resData[key]);
        }

      console.log(adds);

      self.addresses = adds;
    }),
  }))
  // Add Health Conditions
  .actions((self) => ({
    setHealthConditions(health) {
      // self.addresses.push(address);
      const response = fetch(
        `https://chemy-llc.firebaseio.com/healthconditions/${self.userCredentials.uid}.json?auth=${self.userCredentials.token}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(health),
        }
      )
        .then((res) => res.json())
        .catch((err) => console.log(err));
    },
    getHealthConditions: flow(function* fetchAddresses() {
      const response = yield fetch(
        `https://chemy-llc.firebaseio.com/healthconditions/${self.userCredentials.uid}.json?auth=${self.userCredentials.token}`
      );
      const resData = yield response.json();

      console.log(resData);

      if (resData) {
        self.HealthConditions.allergies = resData.allergies;
        self.HealthConditions.diabetes = resData.diabetes;
        self.HealthConditions.lungdiseases = resData.lungdiseases;
        self.HealthConditions.skindiseases = resData.skindiseases;
      } else {
        self.HealthConditions.allergies = false;
        self.HealthConditions.diabetes = false;
        self.HealthConditions.lungdiseases = false;
        self.HealthConditions.skindiseases = false;
      }
    }),
  }))
  // initial State
  .create({
    drugs: [
      // {
      //   id: "4123534523464575675",
      //   name: "hbwycwc 450",
      //   salt: "Cylonndojfhjwncv ",
      //   price: 100,
      //   quantity: 2,
      //   prescription_req: false,
      //   total_amt: 200,
      // },
      // {
      //   id: "32456346345653463456",
      //   name: "hbwycwc 450",
      //   salt: "Cylonndojfhjwncv ",
      //   price: 100,
      //   quantity: 2,
      //   prescription_req: true,
      //   total_amt: 200,
      // },
    ],
    count: 0,
    orders: [],
    profile: {
      display_picture: " ",
      name: "",
      dob: new Date(996656400000),
    },
    addresses: [
      // {
      //   type: "Home",
      //   name: "Abhishek Sah",
      //   add_line_1: "Jogijhora Barabak",
      //   add_line_2: "Ethelbari",
      //   pincode: "735204",
      //   ph_no: "+917908174073",
      // },
    ],
    HealthConditions: {
      allergies: false,
      diabetes: false,
      lungdiseases: false,
      skindiseases: false,
    },
    location: {
      locationShortName: "select current location",
      latitude: 0,
      longitude: 0,
    },
    isAuthenticated: false,
    didTryAutoLogin: false,
    userCredentials: {
      uid: "",
      token: "",
      email: "",
    },
    timer: 0,
  });

export default DrugStore;
