import React, { useEffect, useRef, useState } from 'react'
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet
} from 'react-native'
import { logEvent } from '../services/eventLogger'

export default function SessionScreen({ route, navigation }: any) {
  const email = route?.params?.email || 'User'

  const [seconds, setSeconds] = useState(0)
  const startTimeRef = useRef(new Date())
  const intervalRef = useRef<any>(null)

  useEffect(() => {
    logEvent('session_started', email)

    intervalRef.current = setInterval(() => {
      setSeconds(prev => prev + 1)
    }, 1000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  const formatTime = (total: number) => {
    const hrs = Math.floor(total / 3600)
    const mins = Math.floor((total % 3600) / 60)
    const secs = total % 60

    return `${hrs > 0 ? `${hrs.toString().padStart(2, '0')}:` : ''}${mins
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleAnalytics = () => {
    navigation.navigate('Analytics', { email })
  }

  const handleLogout = () => {
    logEvent('logout', email, {
      duration_seconds: seconds,
      started_at: startTimeRef.current.toISOString()
    })

    navigation.replace('Login')
  }

  return (
    <SafeAreaView style={styles.safe}>
  <View style={styles.wrapper}>
    <View style={styles.card}>
          <Text style={{ fontSize: 22 }}>👤</Text>
        </View>

        <Text style={styles.title}>Session Active</Text>
        <Text style={styles.email}>
          Logged in as {email}
        </Text>

        <View style={styles.card}>
          <Text style={styles.label}>SESSION DURATION</Text>

          <Text style={styles.timer}>
            {formatTime(seconds)}
          </Text>

          <View style={styles.startedBox}>
            <Text style={styles.startedText}>
              Started at {startTimeRef.current.toLocaleTimeString()}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleAnalytics}
          >
            <Text style={styles.buttonText}>View Analytics</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.logoutButton]}
            onPress={handleLogout}
          >
            <Text style={styles.buttonText}>Logout</Text>
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

  iconCircle: {
    backgroundColor: '#14532d',
    padding: 18,
    borderRadius: 50,
    marginBottom: 20
  },

  title: {
    color: 'white',
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5
  },

  email: {
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 25
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
    elevation: 12,

    alignItems: 'center'
  },

  label: {
    color: '#94a3b8',
    marginBottom: 10
  },

  timer: {
    color: '#22c55e',
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 20
  },

  startedBox: {
    backgroundColor: '#1e293b',
    padding: 14,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20
  },

  startedText: {
    color: 'white'
  },

  button: {
    backgroundColor: '#1e293b',
    paddingVertical: 15,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12
  },

  logoutButton: {
    backgroundColor: '#7f1d1d'
  },

  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16
  }
})

