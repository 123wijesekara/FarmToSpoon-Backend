import { response } from "express";
import subCategoryModel from "../models/subCategory.model.js";

export const AddSubCategoryController =async(request,response)=>{
    try{

        const {name,image,category} =request.body

        if(!name && !image && !category[0]){
            return response.status(400).json({
                message :"Provide name,image,category",
                error :true,
                success:false
            })
        }

        const payload ={
            name,
            image,
            category
        }
        const createSubCategory =new subCategoryModel(payload)
        const save =await createSubCategory.save()

        return response.json({
            message :"Sub Category Created",
            data: save,
            error :false,
            success:true
        })

    } catch(error){
        return response.status(500).json({
            message :error.message || error,
            error :true,
            success:false
        })
    }
}

export const getSubCategoryController =async(request,response)=>{
    try{
const data =await subCategoryModel.find().sort({createdAt: -1}).populate('category')
 return response.json({
    message:"Sub Category data",
    data:data,
    error :false,
    success:true
 })

    }catch{
        return response.status(500).json({
            message :error.message || error,
            error :true,
            success:false
        })
    }
}

export const updateSubCategoryController= async(request,response)=>{
    try{
     const {_id,name,image,category} = request.body

 const checkSub = await subCategoryModel.findById(_id)

 if(checkSub){
    return response.status(400).json({
        message :"Check your _id",
        error: true,
        success: false
    })
 }

 const updateSubCategory = await subCategoryModel.findByIdAndUpdate(_id,{
    name,
    image,
    category

 })

 return response.json({
    message:'Update Successfully',
    data: updateSubCategory,
    error :false,
    success:true
 })
    }catch(error){
        return response.status(500).json({
            message :error.message || error,
            error:true,
            success:false
        })
    }
}

export const deleteSubCategoryController =async(request,response)=>{
    try{
        const {_id} =request.body
        console.log("Id",_id)
const deleteSub = await subCategoryModel.findIdAndDelete(_id)

return response.json({
    message:"Delete successfully",
    data: deleteSub,
    error :false,
    success:true
})
    }catch(error){
        return response.status(500).json({
            message :error.message || error,
            error:true,
            success :false
        })
    }
}