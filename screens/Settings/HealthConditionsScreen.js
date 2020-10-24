import { Formik } from "formik";
import React, { useRef, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { showMessage } from "react-native-flash-message";
import SwitchGroup from "../../components/SwitchGroup";
import DrugStore from "../../store/CartStore";

const HealthConditionsScreen = (props) => {
  const formRef = useRef();

  useEffect(() => {
    DrugStore.getHealthConditions();
  }, [props.navigation]);

  useEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            console.log(formRef.current.values);
            DrugStore.setHealthConditions(formRef.current.values);
            showMessage({ message: "Health Updated" });
            DrugStore.getHealthConditions();
          }}
        >
          <Text style={{ color: "blue", fontSize: 17 }}>save</Text>
        </TouchableOpacity>
      ),
    });
  }, []);
  return (
    <ScrollView>
      <Formik
        initialValues={{
          allergies: DrugStore.HealthConditions.allergies,
          lungdiseases: DrugStore.HealthConditions.lungdiseases,
          diabetes: DrugStore.HealthConditions.diabetes,
          skindiseases: DrugStore.HealthConditions.skindiseases,
        }}
        onSubmit={() => {}}
        innerRef={formRef}
      >
        {({ handleSubmit, setFieldValue, values }) => (
          <View
            style={{
              backgroundColor: "#fff",
              margin: 15,
              marginTop: 15,
              //   paddingVertical: 25,
              //   borderWidth: 0.5,
              //   borderColor: "#ccc",
              borderRadius: 15,
              //   justifyContent: "space-around",
              //   alignItems: "center",
              shadowOpacity: 0.3,
              shadowOffset: {
                width: -5,
                height: 10,
              },
              shadowRadius: 10,
            }}
          >
            <SwitchGroup
              onValueChange={(value) => setFieldValue("allergies", value)}
              value={values.allergies}
              label="Allergies (if, any)"
            />
            <SwitchGroup
              onValueChange={(value) => setFieldValue("lungdiseases", value)}
              value={values.lungdiseases}
              label="Lung Diseases"
            />
            <SwitchGroup
              onValueChange={(value) => setFieldValue("diabetes", value)}
              value={values.diabetes}
              label="Diabetes"
            />
            <SwitchGroup
              onValueChange={(value) => setFieldValue("skindiseases", value)}
              value={values.skindiseases}
              label="Skin diseases"
            />
          </View>
        )}
      </Formik>
    </ScrollView>
  );
};

// export const screenOptions = (navData) => {
//   return {
//     headerRight: () => (
//       <TouchableOpacity onPress={form}>
//         <Text style={{ color: "blue", fontSize: 17 }}>save</Text>
//       </TouchableOpacity>
//     ),
//   };
// };

export default HealthConditionsScreen;
