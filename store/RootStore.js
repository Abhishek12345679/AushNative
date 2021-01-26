// import { types } from "mobx-state-tree";

// import { DrugStore } from "./CartStore";
// import { SettingsStore } from "./SettingsStore";

// const RootStore = types
//     .model("RootStore", {
//         cart: types.optional(DrugStore),
//         settings: types.optional(SettingsStore),
//     })
//     .actions((self) => ({}))
//     .views((self) => ({}));

// export default RootStore;

// {
//     bookStore: types.optional(BookStore, {
//         books: {}
//     }),
//     cart: types.optional(CartStore, {
//         entries: []
//     }),
//     view: types.optional(ViewStore, {})
// }