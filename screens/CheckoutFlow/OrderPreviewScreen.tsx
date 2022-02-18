import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import Address from '../../components/Address';
import DrugStore from '../../store/CartStore';
import RazorpayCheckout from 'react-native-razorpay';
import addOrder from '../../helpers/addOrder';
import { toISTString } from '../../helpers/toISTString';
import { colors } from '../../constants/colors';
import CartItem from '../../components/CartItem';
import BigButton from '../../components/BigButton';
import OrderSummary from '../../components/OrderSummary';

const OrderPreviewScreen = (props: any) => {
  const address = DrugStore.addresses[props.route.params.selectedAddressIndex]
  let total_checkout_amt = 0;
  const [checkingOut, setCheckingOut] = useState(false);

  for (let i = 0; i < DrugStore.drugs.length; i++) {
    total_checkout_amt = total_checkout_amt + DrugStore.drugs[i].total_amt;
  }

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
    <ScrollView style={styles.container}>
      <OrderSummary
        datetimestamp={Date.now()}
        totalAmt={total_checkout_amt}
      />
      <Text
        style={{
          marginHorizontal: 30,
          fontSize: 20,
          fontWeight: 'bold',
          color: "#fff",
          marginVertical: 0
        }}>
        Items
      </Text>
      <View
        style={{
          borderRadius: 12,
          width: '100%',
          overflow: 'hidden',
          paddingHorizontal: 20,
          paddingVertical: 5
        }}
      >
        {DrugStore.drugs.map((item, index) => (
          <CartItem
            key={index}
            drug={item}
            keyProp={index}
          />
        ))}
      </View>
      <View style={{ paddingHorizontal: 20 }}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: "#fff",
            marginVertical: 10
          }}>
          Selected Address
        </Text>
        <Address
          address={address}
          style={{
            backgroundColor: colors.SECONDARY
          }}
        />
      </View>
      <View style={{ paddingHorizontal: 20, alignItems: 'center' }}>
        <BigButton
          onPress={initiatePayment}
          text="Pay"
          buttonStyle={{
            backgroundColor: 'skyblue',
            marginVertical: 20
          }}
          loading={checkingOut}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});

export default OrderPreviewScreen;
