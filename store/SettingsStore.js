// import { types } from "mobx-state-tree";

// const address = types.model({
//   type: types.string,
//   name: types.string,
//   add_line_1: types.string,
//   add_line_2: types.string,
//   pincode: types.string,
//   ph_no: types.string,
// });

// const profile = types.model("profile", {
//   name: types.string,
//   dob: types.Date,
//   // dark_mode: types.boolean,
//   addresses: types.array(address),
// });

// export const SettingsStore = types
//   .model("SettingsStore", {
//     profile: profile,
//   })
//   .create({
//     profile: {
//       name: "Abhishek sah",
//       dob: new Date(996656400000),
//       // dark_mode: false,
//       addresses: [
//         {
//           type: "Home",
//           name: "Abhishek sah",
//           add_line_1: "Ethelbari Samaj Pally Road",
//           add_line_2: "Near BSNL Exchange",
//           pincode: "735204",
//           ph_no: "+917908174073",
//         },
//         {
//           type: "Work",
//           name: "Abhijit sah",
//           add_line_1: "Near Steel Bricks",
//           add_line_2: "Khogenhat Road",
//           pincode: "735204",
//           ph_no: "+916563738393",
//         },
//         {
//           type: "Other",
//           name: "Ashkrita",
//           add_line_1: "Near Gajmer Engineering works",
//           add_line_2: "Banarhat",
//           pincode: "735203",
//           ph_no: "",
//         },
//       ],
//     },
//   });

// export default SettingsStore;
