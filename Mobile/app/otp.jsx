import React, { useState, useRef } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Image, ScrollView } from 'react-native';
import { Link } from 'expo-router';

export default function OTP() {
  const [code, setCode] = useState(['', '', '', '']);
  const inputs = useRef([]);

  const handleCodeChange = (text, index) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text && index < 3) {
      inputs.current[index + 1].focus();
    }
  };

  const handleConfirm = () => {
    // Handle OTP confirmation
    console.log("Confirming OTP:", code.join(''));
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Image 
            source={require('../assets/images/onboarding_2.png')} 
            style={styles.illustration}
            resizeMode="contain"
          />
          <Text style={styles.title}>OTP Verification</Text>
          <Text style={styles.subtitle}>Enter OTP Code sent to{'\n'}rafahwalid@gmail.com</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Enter the Code</Text>
          
          <View style={styles.otpContainer}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
                style={styles.otpInput}
                value={digit}
                onChangeText={(text) => handleCodeChange(text, index)}
                keyboardType="number-pad"
                maxLength={1}
                ref={(ref) => inputs.current[index] = ref}
              />
            ))}
          </View>
          
          <Pressable 
            style={styles.button} 
            onPress={handleConfirm}
          >
            <Text style={styles.buttonText}>Confirm</Text>
          </Pressable>

          <View style={styles.links}>
            <Text style={styles.bottomText}>Don't receive OTP? </Text>
            <Link href="/forgot-password" style={styles.linkText}>Resend OTP</Link>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingTop: 50,
    paddingBottom: 30,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  illustration: {
    width: 250,
    height: 250,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  formContainer: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    marginBottom: 15,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  otpInput: {
    borderWidth: 1,
    borderColor: '#52c6b4',
    borderRadius: 8,
    width: 65,
    height: 65,
    fontSize: 24,
    textAlign: 'center',
    backgroundColor: '#fff',
    color: '#333',
  },
  button: {
    backgroundColor: '#555555',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 30,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  links: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomText: {
    color: '#666',
    fontSize: 14,
  },
  linkText: {
    color: '#52c6b4',
    fontSize: 14,
    fontWeight: '600',
  }
});
