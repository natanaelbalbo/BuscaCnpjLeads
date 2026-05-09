import { Router } from 'express'
import { createLead, getLeadById, listLeads } from '../controllers/lead.controller'

const router = Router()

router.post('/', createLead)
router.get('/', listLeads)
router.get('/:id', getLeadById)

export default router
