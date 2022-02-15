import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Address from '../../components/Address';
import DrugStore from '../../store/CartStore';

import RazorpayCheckout from 'react-native-razorpay';

import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';
import addOrder from '../../helpers/addOrder';

const OrderPreviewScreen = props => {
  const [address, _] = useState(
    DrugStore.addresses[props.route.params.selectedAddressIndex],
  );

  let total_checkout_amt = 0;

  const [checkingOut, setCheckingOut] = useState(false);


  for (let i = 0; i < DrugStore.drugs.length; i++) {
    total_checkout_amt = total_checkout_amt + DrugStore.drugs[i].total_amt;
  }

  const toISTString = unixtime => {
    const dateObject = new Date(unixtime);
    const humanDateFormat = dateObject.toString();
    return humanDateFormat.substring(0, humanDateFormat.indexOf(':') - 3);
  };

  const createOrder = async () => {
    const response = await fetch(
      'https://razorpay-payments-api.herokuapp.com/orders',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.trunc(total_checkout_amt * 100),
          currency: 'INR',
          receipt: 'rcptid_11',
        }),
      },
    );

    const resData = await response.json();

    return resData.id;
  };

  const verifySignature = async (order_id: any, pid: any, signature: any) => {
    // console.log({ order_id, pid, signature });
    const response = await fetch(
      'https://razorpay-payments-api.herokuapp.com/verifysignature',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          order_id: order_id,
          razor_pid: pid,
          signature: signature,
        }),
      },
    );
    const resData = await response.json();
    return resData;
  };

  const openPaymentDialog = async (order_id) => {
    try {
      if (address) {
        const RPPaymentOptions = {
          description: `${DrugStore.drugs.length} Medicines you ordered.`, //product description
          image: DrugStore.drugs[0].imageUrl, // product image
          currency: 'INR',
          key: 'rzp_test_spbocQblrbzEdw',
          amount: total_checkout_amt * 100,
          name: DrugStore.drugs[0].name + `and ${DrugStore.drugs.length - 1} others`,
          order_id: order_id,
          prefill: {
            email: DrugStore.userCredentials.email,
            contact: address.ph_no,
            name: DrugStore.profile.name,
          },
          theme: { color: '#000000' },
        };

        const paymentResponse = await RazorpayCheckout.open(RPPaymentOptions);
        setCheckingOut(false);

        const verificationResponse = await verifySignature(
          order_id,
          paymentResponse.razorpay_payment_id,
          paymentResponse.razorpay_signature,
        );

        if (verificationResponse) {
          console.log('Success:', verificationResponse);
          try {
            await addOrder({
              items: DrugStore.drugs,
              datetimestamp: new Date().getTime(),
              address: address,
              total_amt: total_checkout_amt,
              order_id: order_id,
              status: verificationResponse.status,
              // prescription: fileUrl,
            });

            props.navigation.navigate('OrderConfirmation', {
              status: verificationResponse.status,
            });
            // remove cartItems
            if (verificationResponse.status === true) {
              DrugStore.clearCart();
            }
          } catch (err) {
            console.error(err);
          }
        }
      }

    } catch (err) {
      setCheckingOut(false);
      console.error(`Error: ${err} ${err.code} | ${err.description}`);
    }
  };

  const initiatePayment = async () => {
    setCheckingOut(true);
    try {
      const orderId = await createOrder();
      await openPaymentDialog(orderId);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <ScrollView style={styles.container} stickyHeaderIndices={[0]}>
      <View
        style={{
          flex: 1,
          backgroundColor: '#fff',
          shadowColor: '#000',
          shadowOpacity: 0.69,
        }}
        pointerEvents="none">
        <ProgressSteps activeStep={1} marginBottom={0}>
          <ProgressStep
            label="Select Address"
            previousBtnText=""
            nextBtnText=""></ProgressStep>
          <ProgressStep
            label="OrderPreview"
            previousBtnText=""
            nextBtnText=""></ProgressStep>
          <ProgressStep
            label="Payment"
            previousBtnText=""
            nextBtnText=""></ProgressStep>
        </ProgressSteps>
      </View>
      <View style={styles.item}>
        <View style={styles.textContainer}>
          <Text style={styles.boldtext}>Order Date</Text>
          <Text>{toISTString(new Date())}</Text>
        </View>
        <View style={styles.textContainer}></View>
        <View style={styles.textContainer}>
          <Text style={styles.boldtext}>Order Total</Text>
          <Text style={{ color: 'green', fontWeight: 'bold' }}>
            ₹{total_checkout_amt}
          </Text>
        </View>
      </View>

      <Text style={{ marginTop: 35, marginLeft: 20, fontSize: 30, fontWeight: 'bold' }}>Items</Text>
      <View style={{ padding: 0 }}>
        {DrugStore.drugs.map((item, index) => (
          <View
            style={{
              ...styles.item,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
            key={index}>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center'
              }}
            >
              <Image
                source={{ uri: item.imageUrl }}
                style={{
                  width: 75,
                  height: 75,
                }}
              />
              <View>
                <Text style={{ ...styles.boldtext, width: 150 }}>
                  {item.name}
                </Text>
                <Text>{item.salt}</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                    marginTop: 10,
                  }}>
                  <Text style={{ color: 'green' }}>₹ {item.price}</Text>
                  <Text> x {item.quantity} = </Text>
                  <Text style={{ color: 'green', fontWeight: 'bold' }}>
                    ₹{item.total_amt.toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>
      <View style={{ paddingHorizontal: 20 }}>
        <Text style={{ paddingVertical: 25, fontSize: 30, fontWeight: 'bold' }}>
          Address
        </Text>
        <Address address={address} />
      </View>
      <View style={{ paddingHorizontal: 20, alignItems: 'center' }}>
        <TouchableOpacity
          style={{
            marginVertical: 20,
            height: 60,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#000',
            marginBottom: 40,
            width: '100%',
          }}
          onPress={initiatePayment}>
          {!checkingOut ? (
            <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>
              Pay
            </Text>
          ) : (
            <ActivityIndicator size="small" color="#FFF" />
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
  },
  item: {
    marginHorizontal: 25,
    marginVertical: 10,
    padding: 5,
    borderRadius: 10,
    overflow: 'hidden',
  },
  textContainer: {
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  boldtext: {
    fontSize: 15,
    fontWeight: 'bold',
    width: 100,
    marginEnd: 5,
  },
});

export default OrderPreviewScreen;
