import {observer} from 'mobx-react';
import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

const OrderItem = observer(props => {
  const toISTString = unixtime => {
    const dateObject = new Date(unixtime);
    const humanDateFormat = dateObject.toString();
    // return humanDateFormat.substring(0, humanDateFormat.indexOf("G"));
    return humanDateFormat.substring(0, humanDateFormat.indexOf(':') - 3);
  };

  // console.log("ITEMDATA-", itemData);
  const itemData = props.itemData;

  return (
    <>
      {props.status && (
        <TouchableOpacity
          style={{
            backgroundColor: '#FFF',
            padding: 20,
            borderRadius: 10,
            marginVertical: 10,
            shadowOpacity: 0.3,
            shadowOffset: {
              width: 0,
              height: 0,
            },
            shadowRadius: 20,
          }}
          onPress={props.onPress}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text style={{fontSize: 17, fontWeight: '500'}}>
              {toISTString(itemData.datetimestamp)}
            </Text>
            <View style={{alignItems: 'center'}}>
              <Text style={{fontWeight: 'bold'}}>Total</Text>
              <Text style={{color: '#006400', fontWeight: '500'}}>
                ₹{itemData.total_amt}
              </Text>
            </View>
          </View>
          <View
            style={{
              backgroundColor: '#e0e0e0',
              marginTop: 10,
              width: '100%',
              paddingStart: 10,
              borderRadius: 10,
            }}>
            {itemData['items'].map((item, index) => (
              <View
                key={index}
                style={{
                  flexDirection: 'row',
                  marginVertical: 10,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    // backgroundColor: "#000",
                    width: '100%',
                    paddingHorizontal: 20,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{fontWeight: 'bold', fontSize: 17, marginEnd: 5}}>
                      {item.quantity}
                    </Text>
                    <Text
                      style={{fontWeight: '500', fontSize: 15, marginEnd: 5}}>
                      {item.name}
                    </Text>
                  </View>
                  <Text style={{fontWeight: '500', fontSize: 15, marginEnd: 5}}>
                    ₹{item.price}
                  </Text>
                </View>
              </View>
            ))}
          </View>
          {/* Icon > add */}
        </TouchableOpacity>
      )}
    </>
  );
});

export default OrderItem;
