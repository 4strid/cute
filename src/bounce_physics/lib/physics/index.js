import Cute from '../../../lib/cute'

import Physics from './Physics'
import Body from './Body'
import Static from './Static'
import WorldBounds from './WorldBounds'
import Collider from './Collider'

const PhysicsContext = Cute.createContext()

PhysicsContext.addProvider(Physics, instance => ({ physics: instance }))
PhysicsContext.addConsumer(Body)
PhysicsContext.addConsumer(Static)
PhysicsContext.addConsumer(Collider)
