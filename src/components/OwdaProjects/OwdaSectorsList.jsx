
import React, { useState, useEffect,Fragment } from 'react';import CountsSection from 'components/Counts/Counts' 

import CTA from '../../components/CTA'
import InfoCard from '../../components/Cards/InfoCard'
import ChartCard from '../../components/Chart/ChartCard'
import { Doughnut, Line } from 'react-chartjs-2'
import { AuthContext } from '../../hooks/authContext'
import { useContext } from 'react'
import ChartLegend from '../../components/Chart/ChartLegend'
import PageTitle from '../../components/Typography/PageTitle'
import { ChatIcon, CartIcon, MoneyIcon, PeopleIcon, TrashIcon, EditIcon } from '../../icons'
import RoundIcon from '../RoundIcon'
import response from '../../utils/demo/tableData'
import { PlusCircleIcon } from "@heroicons/react/outline";
import { DocumentAddIcon } from '@heroicons/react/outline';
import "config/custom-button.css"
import { ErrorAlert, SuccessAlert } from "components/Alert";import 'config/custom-button.css'


import {
  TableBody,
  TableContainer, 
  Table,
  TableHeader,
  TableCell,
  TableRow,
  TableFooter,
  Avatar,
  Badge,
  Pagination,
  Button,
} from '@windmill/react-ui'
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@windmill/react-ui'
import { Input, HelperText, Label, Select, Textarea } from '@windmill/react-ui'

import {
  doughnutOptions,
  lineOptions,
  doughnutLegends,
  lineLegends,
} from '../../utils/demo/chartsData'
import { Link, withRouter } from 'react-router-dom'
import { url } from 'config/urlConfig'
import axios from 'config/axiosConfig';import TitleChange from "components/Title/Title";





const OwdaSectorsList = () => {
    const {authState,settings} = useContext(AuthContext)
    const [searchResult,setSearchResult] = useState([])
    const [searchTerm,setSearchTerm] = useState("")
    const [fetchedResult,setFetchedResult] = useState([])
    const [countsData,setCountsData] = useState({ projectCount:"",bidCount:"",activeProjects:"",completedProjects:""})
    const [sectors,setSectors] = useState([])
    const [sectorsForm,setSectorsForm] = useState({
        name:"",

    })


    // Notifications
    const [openSuccess, setOpenSuccess] = useState({ open: false, message: "" });

    const handleCloseSuccess = (event, reason) => {
      if (reason === "clickaway") {
        return;
      }
  
      setOpenSuccess({ open: false, message: "" });
    };
  
    const [openError, setOpenError] = useState({ open: false, message: "" });
  
    const handleCloseError = (event, reason) => {
      if (reason === "clickaway") {
        return;
      }
  
      setOpenError({ open: false, message: "" });
    };

    // End of notifications
    const [isOpen,setIsOpen] = useState(false)
    function closeModal(){
        setIsOpen(false)
    }
    function openModal(){
        setIsOpen(true)
    }



      useEffect(()=>{
        const getData=async()=>{
            await axios.get(`${url}/sector`,{withCredentials:true}).then((resp)=>{
                setSectors(resp.data)
             
            }).catch((error)=>{
                if (error.response && error.response.data && error.response.data.error) {
                    setOpenError({open:true,message:`${error.response.data.error}`});
                  } else {
                    setOpenError({open:true,message:"An unknown error occurred"});
                  }
            })
          
           

          
            await axios.get(`${url}/counts`,{withCredentials:true}).then((resp)=>{
              const data = resp.data
              setCountsData({ projectCount:data.projectsCount,bidCount:data.countBids,activeProjects:data.activeProjectsCount,completedProjects:data.completedProjects})
            }).catch((error)=>{
                if (error.response && error.response.data && error.response.data.error) {
                    setOpenError({open:true,message:`${error.response.data.error}`});
                  } else {
                    setOpenError({open:true,message:"An unknown error occurred"});
                  }
            })
        
        }

        getData()
    
    },[])

      
    
      const handleSubmit = async(e) => {
        e.preventDefault();
        await axios.post(`${url}/sector`,sectorsForm,{withCredentials:true}).then((resp)=>{
          if(resp.data.error){
            setOpenError({open:true,message:`${resp.data.error}`})
          }else{
            // console.log(resp.data);
            setSectors((prev)=>[...prev,resp.data])
            setOpenSuccess({open:true,message:"Successfully Added"})
            closeModal();   
          }

        }).catch((error)=>{
            if (error.response && error.response.data && error.response.data.error) {
                setOpenError({open:true,message:`${error.response.data.error}`});
              } else {
                setOpenError({open:true,message:"An unknown error occurred"});
              }
        })

       
      };

      
      useEffect(()=>{
        setFetchedResult(searchTerm.length<1?sectors:searchResult)
      },[sectors,searchTerm])
  
  
    const searchHandler = async(search)=>{
      setSearchTerm(search)
      if(search!==0){
        const newPayroll = sectors?.filter((empl)=>{
          return Object.values(empl).join(" ").toLowerCase().includes(search.toLowerCase())
        })
        // console.log(newEmployeeList);
        setSearchResult(newPayroll)
      }else{
        setSearchResult(sectors)
      }
    }







  const [isDeleteOpen,setIsDeleteOpen] = useState({open:false,id:""})

  const closeDelete = ()=>{
    setIsDeleteOpen(false)
}
  const openDelete = (id)=>{
    setIsDeleteOpen({open:true,id})
}



  // Delete row
  const handleDelete = async()=>{
    await axios.delete(`${url}/sector/${isDeleteOpen.id}`,{withCredentials:true}).then((resp)=>{
        const data = sectors.filter((dt)=>dt.id!==isDeleteOpen.id)
        setSectors(data)
        setOpenSuccess({open:true,message:"deleted Successfully"})
        closeDelete()
        
    }).catch((error)=>{
        if (error.response && error.response.data && error.response.data.error) {
            setOpenError({open:true,message:`${error.response.data.error}`});
          } else {
            setOpenError({open:true,message:"An unknown error occurred"});
          }
    })
}



  
    return (
      <>
  
        <PageTitle>Sectors</PageTitle>
        <TitleChange name={`${settings.name} | Dashboard`}/><ErrorAlert
        open={openError.open}
        handleClose={handleCloseError}
        message={openError.message}
        horizontal="right"
      />
      <SuccessAlert
        open={openSuccess.open}
        handleClose={handleCloseSuccess}
        message={openSuccess.message}
        horizontal="right"
      />

      {/* Search section */}
        <div className='mb-5'>
        <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
        <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" strokeWidth="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <Input type="search" id="default-search" value={searchTerm} onChange={(e)=>searchHandler(e.target.value)} 
            className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 
            dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search sectors..." required />
        </div>
            
        </div>
        {/* End of search List */}

       <CountsSection/>
  



        <TableContainer>
      {/* Delete Confirm section */}
        <Modal isOpen={isDeleteOpen.open} onClose={closeDelete}>
          <ModalHeader>Confirm Action</ModalHeader>
          <ModalBody>
            <p>Are you sure you want to perform this action?</p>
          </ModalBody>
          <ModalFooter>
            <button className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600" onClick={handleDelete}>
              Confirm
            </button>
          </ModalFooter>
      </Modal>

        {/* End of delete Section */}

        <Button onClick={openModal} className="custom-button">New Sector</Button>
  
      
        </TableContainer>

        <Modal isOpen={isOpen} onClose={closeModal}>
      <ModalHeader>Register Sector</ModalHeader>
      <ModalBody>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4">
          


          <Label>
            <span>Name</span>
            <Input
            //   type="number"
              className="mt-1"
              name="name"
              onChange={(e)=>setSectorsForm({...sectorsForm,name:e.target.value})}
              required
            />
          </Label>


         



        </div>
        <div className="hidden sm:block">

        <Button className="mt-6 custom-button" type="submit">Submit</Button>
        </div>
           <div className=" mt-2 block  sm:hidden">
            <Button block size="large" type="submit" className="custom-button">
              Accept
            </Button>
          </div>
      
        </form>
      </ModalBody>
      <ModalFooter>
      <div className="hidden sm:block">
            <Button layout="outline" onClick={closeModal}>
              Cancel
            </Button>
        </div>
        <div className="block w-full sm:hidden">
            <Button block size="large" layout="outline" onClick={closeModal}>
              Cancel
            </Button>
          </div>

          {/* <div className="block w-full sm:hidden">
<Button block size="large" type="submit" className="custom-button">
              Accept
            </Button>
          </div> */}
      </ModalFooter>
    </Modal>


  
        


        <TableContainer className="bg-white rounded-lg shadow-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell className="font-semibold">Sectors</TableCell>
            <TableCell className="font-semibold text-center">Actions</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fetchedResult?fetchedResult.map((row, i) => (
            <Fragment key={i}>
              <TableRow>
                
                <TableCell><span className="text-sm font-semibold">{row.name}</span></TableCell>
                <TableCell className="flex justify-center space-x-2">
                  <Link to={`/app/sector/${row.id}`}>
                  <Button layout="link" size="small">
                    <EditIcon className="h-5 w-5 text-blue-600" />
                  </Button>
                  </Link>
                  <Button layout="link" size="small" onClick={() => openDelete(row.id)}>
                    <TrashIcon className="h-5 w-5 text-red-600" />
                  </Button>
                </TableCell>
              </TableRow>
            </Fragment>
          )):""}
        </TableBody>
      </Table>
    </TableContainer>

      </>
    )


   

}




export default OwdaSectorsList