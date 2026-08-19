import { lookup } from 'node:dns/promises'

const MAX_REDIRECTS = 3

function isPrivateIpv4(value: string) {
  const parts = value.split('.').map(Number)
  if (parts.length !== 4 || parts.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) return false
  const [a, b] = parts
  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 100 && b >= 64 && b <= 127) ||
    a >= 224
  )
}

function isPrivateAddress(address: string) {
  const normalized = address.toLowerCase()
  return (
    isPrivateIpv4(normalized) ||
    normalized === '::1' ||
    normalized === '::' ||
    normalized.startsWith('fe80:') ||
    normalized.startsWith('fc') ||
    normalized.startsWith('fd')
  )
}

async function assertPublicHttpUrl(value: string) {
  let url: URL
  try {
    url = new URL(value)
  } catch {
    throw new Error('A valid public URL is required')
  }

  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    throw new Error('Only HTTP(S) URLs are allowed')
  }

  const hostname = url.hostname.toLowerCase()
  if (hostname === 'localhost' || hostname.endsWith('.localhost') || isPrivateAddress(hostname)) {
    throw new Error('Private network URLs are not allowed')
  }

  let addresses: { address: string }[]
  try {
    addresses = await lookup(hostname, { all: true })
  } catch {
    throw new Error('Could not resolve the requested host')
  }

  if (addresses.length === 0 || addresses.some(({ address }) => isPrivateAddress(address))) {
    throw new Error('Private network URLs are not allowed')
  }

  return url
}

/** Fetch an external public URL while rejecting private hosts and unsafe redirects. */
export async function fetchPublicUrl(input: string, init: RequestInit = {}) {
  let url = await assertPublicHttpUrl(input)

  for (let redirectCount = 0; redirectCount <= MAX_REDIRECTS; redirectCount += 1) {
    const response = await fetch(url, { ...init, redirect: 'manual' })
    if (response.status < 300 || response.status >= 400) return response

    const location = response.headers.get('location')
    if (!location) throw new Error('Redirect response is missing a location')
    if (redirectCount === MAX_REDIRECTS) throw new Error('Too many redirects')
    url = await assertPublicHttpUrl(new URL(location, url).toString())
  }

  throw new Error('Too many redirects')
}
