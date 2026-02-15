import React, { useState, useEffect } from 'react'
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native'
import { validateOtp, generateOtp } from '../services/otpManager'
import { logEvent } from '../services/eventLogger'

export default function OtpScreen({ route, navigation }: any) {
  const { email } = route.params

  const [otp, setOtp] = useState('')
  const [timer, setTimer] = useState(60)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (timer === 0) return

    const interval = setInterval(() => {
      setTimer(prev => prev - 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [timer])

  const handleVerify = async () => {
    if (otp.length !== 6) {
      Alert.alert('Error', 'Enter 6 digit OTP')
      return
    }

    try {
      setLoading(true)

      const result = await validateOtp(email, otp)

      if (result.success) {
        logEvent('otp_validation_success', email)
        navigation.replace('Session', { email })
      } else {
        logEvent('otp_validation_failed', email)
        Alert.alert(result.message ?? 'Invalid OTP')
      }

    } catch (error) {
      Alert.alert('Error', 'Verification failed')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    try {
      await generateOtp(email)
      logEvent('otp_generated', email, { resend: true })
      setTimer(60)
      setOtp('')
      Alert.alert('New OTP sent')
    } catch (error) {
      Alert.alert('Error', 'Failed to resend OTP')
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
  <View style={styles.wrapper}>
    <View style={styles.card}>

          <Text style={styles.title}>Verify OTP</Text>
          <Text style={styles.subtitle}>
            Enter the 6 digit code sent to {email}
          </Text>

          <Text style={styles.timer}>
            00:{timer < 10 ? `0${timer}` : timer}
          </Text>

          <TextInput
            style={styles.input}
            value={otp}
            onChangeText={setOtp}
            keyboardType="numeric"
            maxLength={6}
            placeholder="------"
            placeholderTextColor="#94a3b8"
          />

          <TouchableOpacity
            style={[styles.button, loading && { opacity: 0.7 }]}
            onPress={handleVerify}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Verifying...' : 'Verify'}
            </Text>
          </TouchableOpacity>

          {timer === 0 && (
            <TouchableOpacity onPress={handleResend}>
              <Text style={styles.resend}>Resend OTP</Text>
            </TouchableOpacity>
          )}

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
    marginBottom: 20
  },

  timer: {
    color: '#22c55e',
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 18,
    fontWeight: '600'
  },

  input: {
    backgroundColor: '#1e293b',
    color: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 20,
    letterSpacing: 10
  },

  button: {
    backgroundColor: '#22c55e',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15
  },

  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16
  },

  resend: {
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 5
  }
})
