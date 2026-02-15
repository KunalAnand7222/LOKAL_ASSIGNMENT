import React, { useState } from 'react'
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native'
import { generateOtp } from '../services/otpManager'
import { logEvent } from '../services/eventLogger'

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const isValidEmail = (value: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  }

  const handleSendOtp = async () => {
    const trimmedEmail = email.trim()

    if (!trimmedEmail) {
      Alert.alert('Error', 'Please enter your email')
      return
    }

    if (!isValidEmail(trimmedEmail)) {
      Alert.alert('Error', 'Please enter a valid email address')
      return
    }

    try {
      setLoading(true)

      logEvent('login_attempt', trimmedEmail)

      await generateOtp(trimmedEmail)

      logEvent('otp_generated', trimmedEmail)

      navigation.navigate('OtpScreen', { email: trimmedEmail })

    } catch (error) {
      Alert.alert('Error', 'Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
  <View style={styles.wrapper}>
    <View style={styles.card}>
          <Text style={styles.title}>Sign In</Text>
          <Text style={styles.subtitle}>
            Enter your email to receive OTP
          </Text>

          <TextInput
            placeholder="you@example.com"
            placeholderTextColor="#94a3b8"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TouchableOpacity
            style={[
              styles.button,
              loading && { opacity: 0.7 }
            ]}
            onPress={handleSendOtp}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Sending...' : 'Send OTP'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0f172a'
  },

  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20
  },

  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#111827',
    paddingVertical: 35,
    paddingHorizontal: 30,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1f2937',

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.4,
    shadowRadius: 25,
    elevation: 12
  },

  title: {
    color: 'white',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center'
  },

  subtitle: {
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 25
  },

  input: {
    backgroundColor: '#1e293b',
    color: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    fontSize: 15
  },

  button: {
    backgroundColor: '#22c55e',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center'
  },

  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16
  }
})
