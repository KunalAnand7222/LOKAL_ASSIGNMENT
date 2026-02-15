type EventType = {
  event: string
  email: string
  time: string
  metadata?: any
}

let eventStore: EventType[] = []

export const logEvent = (
  event: string,
  email: string,
  metadata?: any
) => {
  eventStore.unshift({
    event,
    email,
    time: new Date().toLocaleTimeString(),
    metadata: metadata ?? '--'
  })
}

export const getEvents = () => {
  return eventStore
}
