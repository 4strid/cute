import Cute from '../../../lib/cute'

import Physics from './Physics'
import Body from './Body'
import Static from './Static'
import WorldBounds from './WorldBounds'
import Collider from './Collider'

const PhysicsContext = Cute.createContext()

PhysicsContext.addProvider(Physics, physics => ({ physics }))
PhysicsContext.addConsumer(Body)
PhysicsContext.addConsumer(Static)
PhysicsContext.addConsumer(Collider)

export Physics, Body, Static, WorldBounds, Collider
