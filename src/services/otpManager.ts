import AsyncStorage from '@react-native-async-storage/async-storage'
import { OtpRecord } from '../types/auth'

const STORAGE_KEY = 'OTP_STORAGE'

const getStorage = async (): Promise<Record<string, OtpRecord>> => {
  const data = await AsyncStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : {}
}

const setStorage = async (data: Record<string, OtpRecord>) => {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export const generateOtp = async (email: string) => {
  const storage = await getStorage()

  const otp = Math.floor(100000 + Math.random() * 900000).toString()

  storage[email] = {
    otp,
    expiresAt: Date.now() + 60000,
    attempts: 0
  }

  await setStorage(storage)

  console.log('OTP generated:', otp)

  return otp
}
export const validateOtp = async (
  email: string,
  inputOtp: string
): Promise<{ success: boolean; message?: string }> => {
  const storage = await getStorage()
  const record = storage[email]

  if (!record)
    return { success: false, message: 'No OTP found' }

  if (Date.now() > record.expiresAt)
    return { success: false, message: 'OTP expired' }

  if (record.attempts >= 3)
    return { success: false, message: 'Max attempts exceeded' }

  if (record.otp !== inputOtp) {
    record.attempts += 1
    storage[email] = record
    await setStorage(storage)
    return { success: false, message: 'Incorrect OTP' }
  }

  delete storage[email]
  await setStorage(storage)

  return { success: true }
}
