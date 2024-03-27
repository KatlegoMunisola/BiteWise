import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';


const LoginScreen = ({navigation}) => {
    return (
        <View style={styles.container}>
        <Text>LoginScreen</Text>
        <Button
            title='Click here'
            onPress={() => alert("Button Clicked!")}
        />
        </View>
        
    );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center'
  },
});