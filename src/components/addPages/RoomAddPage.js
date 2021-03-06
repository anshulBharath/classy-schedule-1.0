/**
 * RoomAddPage is responsible for creating an html div that allows the user to
 * create new room objects. 
 * It will also store the entered information as state.
 *
 *
 * Bugs:
 *    - None currently known
 *
 * @authors Anshul Bharath, Joseph Heimel, Glennon Langan, Samuel Swanson
 */
import { Box, TextField, Grid} from '@mui/material'
//import { AsyncTaskManager } from 'builder-util'
import { React, useState, useEffect } from 'react'
import {FaTimes, FaPencilAlt} from 'react-icons/fa'
import './../../assets/styles/HomePage.css';
import './../../assets/styles/SideNav.css';
import './../../assets/styles/AddPages.css';
import SideNavigation from './../SideNavigation.js';
import TopBar from './../TopBar.js';
import DataViewer from '../DataViewer';
 



/**
 * The component that will be exported. This page will have an Add form 
 * and list the Rooms that have been added and the rooms that are in the database.
 * 
 * @param onAddRoom - the function 'addRoom' from App.js that will fire when 
 *                    the RoomAddPage is submitted
 * @param onEditRoom - The function 'editRoom' from App.js that will
*                      fire when the edit icon is clicked on a room item
 * @param rooms - the state of rooms passed from App.js
 * @param onDelete - Handler function that deletes an individual item from the list
 */
const RoomAddPage = ({onAddRoom, onEditRoom, rooms, onDelete}) => {

    // Edit functionality state management
    const [roomEditedId, setRoomEditedId] = useState(null);
    const [editedRoom, setEditedRoom] = useState(null);
    const [refresh, setRefresh] = useState('');

    // Handles state changes at the start of editing
    const onEdit = roomId => e => {
        setRoomEditedId(roomId);
        setEditedRoom(roomId === null ? null : rooms.find(p => p.id === roomId));
        console.log({roomId})
    }

    // Handles state changes at the end of editing
    const resetState = () => {
        setEditedRoom(null);
        setRoomEditedId(null);
        setRefresh('Refresh');
    }

    /**
      * This function works in tandem to other validating functions
      * This updates state with the passed state setter if 
      * the passed validate function returns true
      * 
      * @param validateFN  - Validating function
      * @param stateSetter - State updating function
      */
    const validate = (validateFN, stateSetter) => e => {
        stateSetter(oldValue => validateFN(e.target.value) ? e.target.value : oldValue);
    }

    /**
     * This component represents the form that will be used by the user to
     * enter in new room data.
     * 
     * @param onAddRoom - the addSubmit function that is passed down from App.js
     * @param onEditRoom - function taht is passed down from App.js
     * @returns          - React component div used to enter 
    *                      and submit professor information
     */
    const RoomAdd = ({onAddRoom, onEditRoom}) => {
        const [building, setRBuilding] = useState(roomEditedId === null ? '' : editedRoom.building)
        const [number, setRNumber] = useState(roomEditedId === null ? '' : editedRoom.number)
        const [capacity, setRCapacity] = useState(roomEditedId === null ? '' : editedRoom.capacity)

        /**
         * Makes sure the code is all uppercase letters and no greater than 3 characters
         * 
         * @param val - Input value
         * @returns boolean - true 3 or less uppercase letters
         */
        const validRBuilding = val => 
        [...val.matchAll(/([A-Z][A-Z][A-Z]|[A-Z][A-Z]|[A-Z])?/g)].some
        (x => x[0] === val) || val === '';

        // This function calls passes other functions to validate
        const validateRBuilidng = validate(validRBuilding, setRBuilding);
        
        /**
         * Makes sure there is a postive integer less than 1000
         * 
         * @param val - Input value
         * @returns boolean - true if postive integer less tahn 1000
         */
        const validRNumber = val => 
        [...val.matchAll(/([1-9][0-9][0-9]|[1-9][0-9]|[1-9])?/g)].some
        (x => x[0] === val) || val === '';

        // This function calls passes other functions to validate
        const validateRNumber = validate(validRNumber, setRNumber);

        /**
         * Makes sure there is a positive integer of 300 or less
         * 
         * @param val - Input value
         * @returns boolean - true if =<300
         */
        const validRCapacity = val => 
        [...val.matchAll(/(1[0-9][0-9]|2[0-9][0-9]|300|[1-9][0-9]|[1-9])?/g)].some
        (x => x[0] === val) || val === '';

        // This function calls passes other functions to validate
        const validateRCapacity = validate(validRCapacity, setRCapacity);

        /**
        * This function alerts the user if they are missing necessary data,
        * if all necessary data is present, it passes the data and resets to default
        * 
        * @param e - Event object
        * @returns - Alert to user
        */
        const onSubmit = (e) => {
            e.preventDefault()
            e.target.reset()
            if (!building) {
                alert('Please enter a three letter building code')
                return;
            }
            if (!number) {
                alert('Please enter the room number')
                return;
            }
            if (!capacity) {
                alert('Please enter the student capacity')
                return;
            }

            let elementClassName = 'item';
            if(roomEditedId === null){
                onAddRoom({building, number, capacity, elementClassName});
            } else {
                let id = roomEditedId;
                onEditRoom({id, building, number, capacity, elementClassName});
                resetState();
            }

            setRBuilding('');
            setRNumber('');
            setRCapacity('');
        }
        return (
        <div className = 'body-container'>
            <h1> {roomEditedId !== null ? "Edit" : "Add"} Room </h1>
            <form onSubmit = {onSubmit}>



                <br></br>

                <Grid container spacing = {2}>
    
                    <Grid item xs = {6}>
                        <Box>
                            <TextField InputLabelProps = {{ shrink: true }} fullWidth id = "enter_building" label = "Building" variant = "outlined" value = {building} onChange = {validateRBuilidng}/>
                        </Box>
                    </Grid>

                    <Grid item xs = {6}>
                        <Box>
                            <TextField InputLabelProps = {{ shrink: true }} fullWidth id = "enter_room_number" label = "Room Number" variant = "outlined" value  ={number} onChange = {validateRNumber}/>
                        </Box>
                    </Grid>

                    <Grid item xs = {6}>
                        <Box>
                            <TextField InputLabelProps = {{ shrink: true }} fullWidth id = "enter_room_capacity" label = "Room Capacity" variant = "outlined" value = {capacity} onChange = {validateRCapacity}/>
                        </Box>
                    </Grid>
                </Grid>


                <br></br>
                
                {roomEditedId === null ? <input type = "submit" value = 'Save Room' className = 'btn btn-block'/> 
                : <><input type = "submit" value = 'Save Edits' className = 'btn btn-block'/><br /> 
                <input type = "button" value="Cancel Edits" className = 'btn btn-block' onClick = {resetState}/></> }
                </form>
            </div>
        );
    }
        /**
     * This component is a view that lists out individual RoomListItems.
     * 
     * @param rooms - The state of rooms that is passed down from App.js
     * @param onDelete - Handler function that deletes an individual item from the list
     * @param onEdit - Handler function that edits an individual item from the list
     * @returns - React component that lists viewable room components
     */
    const RoomList = ({rooms, onDelete, onEdit}) => {
        return(
        <div className = 'container'>
        {rooms.map((currentRoom, index) => (
            <RoomListItem key = {index} room = {currentRoom} onDelete = {onDelete} onEdit = {onEdit} rooms = {rooms}/>
        ))}
        </div>
        );
    }

    /**
     * The component that will display an individual room. These components will populate the RoomList component.
     * 
     * @param room - an individual room
     * @param onDelete - Handler function that deletes an individual item from the list
     * @param onEdit - Handler function that edits an individual item from the list
     * @param rooms - state of created room objects
     * @returns - React component that displays a single room component
     */
    const RoomListItem = ({room, onDelete, onEdit, rooms}) => {
        return(

            <div className = 'item'>
            <FaTimes style = {{color: 'red', cursor: 'pointer', float:"right"}} onClick={() => onDelete(room.id)}/>
            <FaPencilAlt style={{color:'#90A4AE', cursor: 'pointer', float: "right", clear: "right"}} onClick = {onEdit(room.id)}/>
            <DataViewer id = {room.id} dataState={rooms} sx={{position:'absolute'}}>
                <h3> {"Room: "} {room.building}  {room.number}</h3>
            </DataViewer>
            </div>
        );
    }

    /**
     * This page will have an Add form and list the Rooms that have been added and
     * the rooms that are in the database.
     * 
     * @param onAddRoom - the function 'addRoom' from App.js that will fire 
     *                    when the RoomAddPage is submitted
     * @param onEditRoom - The function 'editRoom' from App.js that will
     *                          fire when the edit icon is clicked on a room item
     * @param rooms - the state of rooms passed from App.js
     * @param onDelete - Handler function that deletes an individual item from the list
     */
    const RoomAddPageContent = ({onAddRoom, onEditRoom, rooms, onDelete}) => {
        return (
        <div className = "home">
            <div className = 'element-page'>
                <RoomAdd onAddRoom = {onAddRoom} onEditRoom = {onEditRoom}/>
                <RoomList onDelete = {onDelete} rooms = {rooms} onEdit = {onEdit}/>
            </div>
        </div>
        );
    }

    useEffect(() => {

    }, [roomEditedId, refresh])
 
    return (
    <div>
        <SideNavigation></SideNavigation>
  
        <div id = "main">
            <div className = "main-div">
                <TopBar></TopBar>
  
                <div className = "container-home">
                  <RoomAddPageContent onAddRoom = {onAddRoom} onEditRoom = {onEditRoom} rooms = {rooms} onDelete = {onDelete} ></RoomAddPageContent>
                </div>
            </div>
        </div>
      </div>
    );
}


export default RoomAddPage