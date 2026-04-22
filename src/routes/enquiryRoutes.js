import express from 'express'
import { sendEnquiry, listEnquiries, deleteEnquiry } from '../controllers/enquiryController.js'

const router = express.Router()

router.post('/enquiry', sendEnquiry)
router.get('/', listEnquiries)
router.delete('/:id', deleteEnquiry)

export default router