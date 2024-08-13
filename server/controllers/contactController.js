const asyncHandler=require('express-async-handler');
const Contact=require('../models/contactModel')
//@desc Get all Contacts
//@route GET /api/contacts
//@access private
const getContacts= asyncHandler(async (req,res)=>{
    const contacts=await Contact.find({user_id:req.user.id});
    res.status(200).json(contacts.reverse());
});


//@  desc get Contact
//@route GET /api/contacts/:id
//@access private
const getContact=asyncHandler(async (req,res)=>{
    const contact=await Contact.findById(req.params.id);
    console.log(contact);
    if(!contact)
    {
        console.log("contact not found")
        res.status(404);
        throw new Error("Contact not found");
    }
    res.status(200).json(contact);
});


//@desc update Contact
//@route PUT /api/contacts/:id
//@access private
const updateContact=asyncHandler(async(req,res)=>{
    const contact=await Contact.findById(req.params.id);
    console.log("vishnu is here");
    if(!contact)
    {
        res.status(200);
        throw new Error("Contact not found");
    }

    if(contact.user_id.toString()!=req.user.id)
    {
        res.status(403);
        throw new Error("user dont have permission to update other uer contacts")
    }
    const updatedContact=await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new:true}
    );
    res.status(200).json(updatedContact);
});

//@desc delete Contact
//@route DELETE /api/contacts/:id
//@access public
const deleteContact=asyncHandler(async(req,res)=>{
    const contact=await Contact.findById(req.params.id);
    if(!contact)
    {
        res.status(400);
        throw new Error("Contact not found");
    }
    if(contact.user_id.toString()!=req.user.id)
    {
        res.status(403);
        throw new Error("user dont have permission to update other uer contacts")
    }
    await Contact.deleteOne({_id:req.params.id});
    const mycontacts=await Contact.find({user_id:req.user.id});
    res.status(200).json({contact,mycontacts:mycontacts.reverse()});
})


//@desc create Contact
//@route POST /api/contacts/
//@access public
const createContact=asyncHandler(async(req,res)=>{
    console.log(req.body); 
    console.log("The request body is :",req.body);
    const {name,email,phone}=req.body;
    if(!name || !email || !phone){
        res.status(400);
        throw new Error("All fields are mandatory");
    }
    const contact=await Contact.create(
    {
        name,
        email,
        phone,
        user_id:req.user.id
    });
    res.status(201).json(contact);
})
module.exports={
    getContacts,
    createContact,
    getContact,
    updateContact,
    deleteContact,
};