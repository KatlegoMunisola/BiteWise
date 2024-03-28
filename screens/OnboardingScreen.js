import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Button } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';

const Skip = ({...props}) => (
  <Button
    title='Skip'
    color="#000000"
    {...props}
  />
);
const Next = ({...props}) => (
  <Button
    title='Next'
    color="#000000"
    {...props}
  />
);
const Done = ({...props}) => (
  <TouchableOpacity
  style={{marginHorizontal:10}}
    {...props}
  >
    <Text style={{fontSize:15}}>Done</Text>
  </TouchableOpacity>
);

const Dots = ({selected}) => {
  let backgroundColor;

  backgroundColor = selected? 'rgba(0, 0, 0, 0.8)':'rgba(0, 0, 0, 0.3)';

  return (
    <View
      style={{
        width:5,
        height:5,
        marginHorizontal:3,
        backgroundColor
      }}
    />

  )
};
const OnboardingScreen = ({navigation}) => {
    return (
      <Onboarding
      SkipButtonComponent={Skip}
      NextButtonComponent={Next}
      DoneButtonComponent={Done}
      DotComponent={Dots}
      onSkip={() => navigation.replace("Login")}
      onDone={() => navigation.navigate("Login")} //substitute navigate for replace later
      pages={[
        {
          backgroundColor: '#a6e4d0',
          image: <Image source={require('../assets/onboarding2.png')} />,
          title: 'Scan your meals',
          subtitle: 'Scan food and make sure that there are no unwanted ingredients that could harm you.',
        },
        {
          backgroundColor: '#fdeb93',
          image: <Image source={require('../assets/onboarding2.png')} />,
          title: 'Scan the barcode',
          subtitle: 'Scan the food product’s barcode and make sure that there are no unwanted ingredients that could harm you.',
        },
        {
          backgroundColor: '#fff',
          image: <Image source={require('../assets/onboarding3.png')} />,
          title: 'Scan the ingredient list',
          subtitle: 'Scan the food product’s ingredient list and make sure that there are no unwanted ingredients that could harm you.',
        },
      ]}
    />
        
    );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center'
  },
});