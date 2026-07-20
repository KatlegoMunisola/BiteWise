import React from 'react';
import { Button, Image, Text, TouchableOpacity, View } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';
import { useAppStore } from '../stores/useAppStore';

const Skip = ({ ...props }) => <Button title="Skip" color="#000000" {...props} />;
const Next = ({ ...props }) => <Button title="Next" color="#000000" {...props} />;
const Done = ({ ...props }) => (
  <TouchableOpacity style={{ marginHorizontal: 10 }} {...props}>
    <Text style={{ fontSize: 15 }}>Done</Text>
  </TouchableOpacity>
);

const Dots = ({ selected }: { selected: boolean }) => (
  <View
    style={{
      width: 5,
      height: 5,
      marginHorizontal: 3,
      backgroundColor: selected ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.3)',
    }}
  />
);

// onboarding1.png is a 1046x954 photo, the others are 528x472 illustrations —
// without an explicit size the swiper renders them at natural size and the
// photo overflows the page.
const pageImage = { width: 320, height: 290, resizeMode: 'contain' as const };

const OnboardingScreen = () => {
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);

  return (
    <Onboarding
      SkipButtonComponent={Skip}
      NextButtonComponent={Next}
      DoneButtonComponent={Done}
      DotComponent={Dots}
      onSkip={completeOnboarding}
      onDone={completeOnboarding}
      pages={[
        {
          backgroundColor: '#a6e4d0',
          image: <Image style={pageImage} source={require('../assets/onboarding1.png')} />,
          title: 'Scan your meals',
          subtitle: 'Scan food and make sure that there are no unwanted ingredients that could harm you.',
        },
        {
          backgroundColor: '#fdeb93',
          image: <Image style={pageImage} source={require('../assets/onboarding2.png')} />,
          title: 'Scan the barcode',
          subtitle: 'Scan the food product’s barcode and make sure that there are no unwanted ingredients that could harm you.',
        },
        {
          backgroundColor: '#fff',
          image: <Image style={pageImage} source={require('../assets/onboarding3.png')} />,
          title: 'Scan the ingredient list',
          subtitle: 'Scan the food product’s ingredient list and make sure that there are no unwanted ingredients that could harm you.',
        },
      ]}
    />
  );
};

export default OnboardingScreen;
