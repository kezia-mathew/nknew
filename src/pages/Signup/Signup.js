import {useForm} from 'react-hook-form'
import {yupResolver} from '@hookform/resolvers/yup'
import { useAppData } from '../../AppContext/AppContext'
import * as yup from 'yup'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {addDoc,doc,setDoc} from 'firebase/firestore'
import {usersDatabase} from '../../Firebase/DBtables'
import { db } from '../../Firebase/config'
import "./signup.css"

export const Signup=()=>{
    const [{user},dispatch]=useAppData()
    const navigate=useNavigate()
    useEffect(()=>{
        if(user.uid==null){
            navigate("/")
        }
    },[])

    const schema=yup.object().shape({
        display_name:yup.string().max(25).required(),
        email:yup.string().email().required(),
        college:yup.string().required().max(50),
        branch:yup.string().required().max(30),
        sem:yup.number().min(1).max(8).required()
    })

    

    const {register,handleSubmit,formState:{errors}}=useForm({
        resolver:yupResolver(schema)
    })

    const formSubmit=async(data)=>{

        await setDoc(doc(db,"users",user.uid),{
            branch:data.branch,
            college:data.college,
            email:data.email,
            uid:user.uid,
            name:data.display_name,
            sem:data.sem,
            isCA:false,
        })


        const newLocalUser={
            name:data.display_name,
            email:data.email,
            sem:data.sem,
            branch:data.branch,
            college:data.college,
            uid:user.uid
        }

        dispatch({
            type:'SET_NEW_LOCAL_USER',
            userLocal:newLocalUser
        })

        dispatch({
            type:'SET_VERIFICATION',
            status:true
        })



        navigate("/")
    }

    return (
        <div className="signup">
            <h1>NAKSHATRA '23</h1>
            <p id='p_tag'>FAITH | FABLES | FIESTA</p>
                <div className="pic">
                    {user.uid?<img class="pro-pic" src={user.photoURL} alt="" />:<i></i>}
                </div>
            <form className='signup-form' onSubmit={handleSubmit(formSubmit)}>
                <p id='formNote'>Note : The display name you choose will be your name in certificates</p>
                <div id='nameBox'>
                <label for="name">Display Name</label>
                <input type="text" id='name' {...register("display_name")}/>
                </div>
                <div id='emailBox'>
                  <label for="email">Email</label>  
                  <input type="text" id='email' defaultValue={user.email} {...register("email")}/>
                </div>
                <div id='collegeBox'>
                <label for="college">College Name</label>    
                <input type="text" id='college' {...register("college")}/>
                </div>
                <div id='branchBox'>
                <label for="branch">Branch</label>    
                <input type="text" id='branch' {...register("branch")}/>
                </div>
                <div id='semesterBox'> 
                  <label for="Semester">Semester</label>    
                  <input type="number" id='Semester' {...register("sem")}/>
                </div>
                <div id='buttonSubmit'>
                <input type="submit" value="Sign Up" />
                </div>
            </form>
        </div>
    )
}
