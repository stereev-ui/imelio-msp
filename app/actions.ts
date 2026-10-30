'use server'

import { properties } from '@/lib/properties'

export type EnquiryState = {
  status: 'idle' | 'success' | 'error'
  message?: string
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function submitEnquiry(_prev: EnquiryState, formData: FormData): Promise<EnquiryState> {
  const propertyId = String(formData.get('propertyId') ?? '')
  const name = String(formData.get('name') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim()
  const phone = String(formData.get('phone') ?? '').trim()
  const message = String(formData.get('message') ?? '').trim()

  if (!properties.some((property) => property.id === propertyId)) {
    return { status: 'error', message: 'This listing is no longer available.' }
  }
  if (name.length < 2 || name.length > 100) {
    return { status: 'error', message: 'Please enter your full name.' }
  }
  if (!emailPattern.test(email) || email.length > 200) {
    return { status: 'error', message: 'Please enter a valid email address.' }
  }
  if (phone && !/^[+\d\s()-]{7,20}$/.test(phone)) {
    return { status: 'error', message: 'Please enter a valid phone number.' }
  }
  if (message.length > 1000) {
    return { status: 'error', message: 'Your message is too long (max 1000 characters).' }
  }

  return {
    status: 'success',
    message: `Thanks ${name.split(' ')[0]} — the listing broker will be in touch shortly.`,
  }
}
