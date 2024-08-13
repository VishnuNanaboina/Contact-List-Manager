const express=require('express');
const router=express.Router();

const { 
    getContacts,
    createContact,
    getContact,
    updateContact,
    deleteContact,
    }=require('../controllers/contactController');
const validateToken = require('../middleware/validateTokenHandler');

router.use(validateToken);
router.route('/').post(createContact).get(getContacts);

router.route('/:id').put(updateContact).delete(deleteContact);
router.route('/:id').get(getContact)

module.exports=router;