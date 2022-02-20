import {cast, types} from 'mobx-state-tree';

export type DrugType = {
  id: string;
  imageUrl: string;
  name: string;
  salt: string;
  price: number;
  quantity: number;
  prescription_req: boolean;
  total_amt: number;
};

// Drug Model
const drug = types.model({
  id: types.optional(types.string, ''),
  imageUrl: types.optional(types.string, ''),
  name: types.optional(types.string, ''),
  salt: types.optional(types.string, ''),
  price: types.optional(types.number, 0),
  quantity: types.optional(types.number, 0),
  prescription_req: false,
  total_amt: types.optional(types.number, 0),
});

export type AddressType = {
  type: string;
  name: string;
  add_line_1: string;
  add_line_2: string;
  pincode?: string;
  ph_no: string;
};

// Address Model
const address = types.model({
  type: types.optional(types.string, ''),
  name: types.optional(types.string, ''),
  add_line_1: types.optional(types.string, ''),
  add_line_2: types.optional(types.string, ''),
  pincode: types.optional(types.string, ''),
  ph_no: types.optional(types.string, ''),
});

export type ProfileType = {
  display_picture: string;
  name: string;
  dob: Date;
};

// Profile Model
const profile = types.model({
  display_picture: types.optional(types.string, ''),
  name: types.optional(types.string, 'test'),
  dob: types.optional(types.Date, 0),
});

export type OrderType = {
  items: Array<DrugType>;
  datetimestamp: number;
  address: AddressType;
  total_amt: number;
  order_id: string;
  status: boolean;
  prescription?: string;
};

// Order Model
const order = types.model({
  items: types.optional(types.array(drug), []),
  datetimestamp: types.optional(types.number, 0),
  address: types.optional(address, {}),
  total_amt: types.optional(types.number, 0),
  order_id: types.optional(types.string, ''),
  status: types.optional(types.boolean, false),
  prescription: types.optional(types.string, ''),
});

// User Credentials
const userCredentials = types.model({
  token: types.optional(types.string, ''),
  uid: types.optional(types.string, ''),
  email: types.optional(types.string, ''),
});

export type LocationType = {
  locationShortName: string;
  latitude: number;
  longitude: number;
};

const location = types.model({
  locationShortName: types.optional(types.string, ''),
  latitude: types.optional(types.number, 0),
  longitude: types.optional(types.number, 0),
});

// Main Store
const DrugStore = types
  .model('DrugStore', {
    drugs: types.optional(types.array(drug), []),
    count: types.optional(types.number, 0),
    orders: types.array(order),
    profile: types.optional(profile, {}),
    addresses: types.optional(types.array(address), []),
    isAuthenticated: types.optional(types.boolean, false),
    userCredentials: types.optional(userCredentials, {
      email: '',
      token: '',
      uid: '',
    }),
    didTryAutoLogin: types.optional(types.boolean, false),
    timer: types.optional(types.number, 0),
    location: types.optional(location, {}),
  })
  .views(self => ({
    get getCount() {
      return self.count;
    },
  }))
  // Location
  .actions(self => ({
    saveLocation(name: string, lat: number, long: number) {
      self.location.locationShortName = name;
      self.location.latitude = lat;
      self.location.longitude = long;
    },
  }))
  // settings action
  .actions(self => ({
    setName(name: string) {
      self.profile.name = name;
    },
    setPFP(imageUrl: string) {
      self.profile.display_picture = imageUrl;
    },
    // TODO: add profile data to firebase
  }))
  // Authentication
  .actions(self => ({
    initializeUserCredentials(token: string, uid: string, email: string) {
      self.userCredentials.token = token;
      self.userCredentials.uid = uid;
      self.userCredentials.email = email;
    },
  }))
  // Cart Actions
  .actions(self => ({
    addDrug(drug: DrugType) {
      let total_count = 0;
      let flag = 0;

      self.drugs.forEach(drugItem => {
        // console.log(drug.id === drugItem.id);

        const index = self.drugs.findIndex(x => x.id === drug.id);
        // console.log(index);

        if (drugItem.id === drug.id) {
          self.drugs[0] = {
            id: drugItem.id,
            imageUrl: drugItem.imageUrl,
            name: drugItem.name,
            salt: drugItem.salt,
            price: drugItem.price,
            quantity: drugItem.quantity + drug.quantity,
            prescription_req: drugItem.prescription_req,
            total_amt: parseInt(
              (drugItem.total_amt + drug.quantity * drugItem.price).toFixed(2),
            ),
          };
          flag++;
        }
      });

      if (flag === 0) {
        self.drugs.push(drug);
      }

      for (let i = 0; i < self.drugs.length; i++) {
        total_count += self.drugs[i].quantity;
      }

      self.count = total_count;
    },
    removeFromCart(id: string) {
      self.drugs.forEach((drug, index) => {
        if (id === drug.id) {
          self.count = self.count - drug.quantity;
          self.drugs.splice(index, 1);
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
  .actions(self => ({
    addOrders(orders: Array<OrderType>) {
      self.orders = cast(orders);
    },
    addAddresses(addresses: Array<AddressType>) {
      self.addresses = cast(addresses);
    },
  }))
  .create({});

export default DrugStore;
