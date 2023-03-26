const express=require("express")
const noteRouter=express.Router()
const {NoteModel}=require("../model/note.model")
const jwt=require("jsonwebtoken")

noteRouter.get("/",async(req,res)=>{
      const token=req.headers.authorization
      const decoded=jwt.verify(token,"masai")
   
      try {
            if(decoded){
                  const notes=await NoteModel.find({"userID":decoded.userID})
                  res.status(200).send(notes)
            }
      } catch (error) {
            res.status(400).send({"msg":error.message}) 
      }
})


noteRouter.post("/add",async(req,res)=>{
      //logic
      try {
            const note=new NoteModel(req.body)
      await note.save()
      res.status(200).send({"msg":"Note add succefully"})
            
      } catch (error) {
           res.status(400).send({"msg":error.message}) 
      }
      
})



noteRouter.patch("/update/:id",async(req,res)=>{
      //logic
      const ID=req.params.id
      const payload=req.body

      try {
            await NoteModel.findByIdAndUpdate({_id:ID},payload)
            res.send({"msg":"user has been update food"})

            
      } catch (err) {
            res.send({"msg":"Cannot update food","error":err.message}) 
      }
      
})



noteRouter.delete("/delete/:id",async(req,res)=>{
      const token=req.headers.authorization
      const decoded=jwt.verify(token,"masai")
      const id=req.params.id
      const req_id=decoded.userID
      const note=NoteModel.findOne({_id:id})
      const userID_in_note=note.userID
      try {
            if(req_id===userID_in_note){
                  await NoteModel.findByIdAndDelete({_id:id})
            res.status(200).send({"msg":"notes has been deleted"})

            }else{
                  res.status(400).send({"msg":"Not Authorised"})
            }
            
      } catch (err) {
            res.send({"msg":"Cannot delete","error":err.message}) 
      }
})

module.exports={
      noteRouter
}