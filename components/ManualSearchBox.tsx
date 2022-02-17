import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
} from 'react-native';

import SegmentedControl from '@react-native-community/segmented-control';

interface ManualSearchBoxProps {
  value: string;
  selectedIndex: number;
  onchange: (event: any) => void;
  onchangeText: (text: string) => void;
  onpress: () => void
}

const ManualSearchBox = ({ value, selectedIndex, onchange, onchangeText, onpress }: ManualSearchBoxProps) => {
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 30, fontWeight: 'bold', color: '#fff' }}>
        Search
      </Text>
      <Text style={{ marginTop: 10, color: '#fff' }}>
        We Regret the inconvinience but it seems like our State of the art image
        recognition system is experiencing some issues. Please search for the
        Drug (via name or salt) Manually.
      </Text>
      <View
        style={{ justifyContent: 'space-around', marginTop: 25 }}>
        <SegmentedControl
          values={['Name', 'Salt']}
          selectedIndex={selectedIndex}
          onChange={onchange}
          appearance="dark"
        />

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TextInput
            placeholder={
              selectedIndex === 0
                ? 'Enter the name of the medicine'
                : 'Enter the name of the salt'
            }
            placeholderTextColor="#aaa"
            value={value}
            style={styles.input}
            onChangeText={onchangeText}
            onSubmitEditing={onpress}
          />
        </View>
      </View>
      <View style={{ width: '100%', alignItems: 'center' }}>
        <Pressable
          disabled={!value && value.length < 4}
          style={styles.searchBtn}
          android_ripple={{
            color: '#fff',
            borderless: true,
          }}
          onPress={onpress}>
          <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 20 }}>
            Search
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    width: '100%',
    marginBottom: 10,
    height: 50,
    borderRadius: 5,
    fontSize: 15,
    paddingHorizontal: 10,
    marginTop: 20,
    backgroundColor: '#fff',
  },
  searchBtn: {
    width: '100%',
    height: 60,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    borderRadius: 15,
  },
});

export default ManualSearchBox;
