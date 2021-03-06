/**
 * ProfessorAddPage is responsible for creating an html div that allows the
 * user to create new professor objects.
 * It will also store the entered information as state.
 * 
 * @authors Anshul Bharath, Joseph Heimel, Glennon Langan, Samuel Swanson
 */

 import { Box, InputLabel, FormControl, MenuItem, Select, Chip, OutlinedInput,
   TextField, Grid } from '@mui/material';
 import { React, useState, useEffect } from 'react';
 import {FaTimes, FaPencilAlt} from 'react-icons/fa';
 
 import './../../assets/styles/HomePage.css';
 import './../../assets/styles/SideNav.css';
 import './../../assets/styles/AddPages.css';
 import SideNavigation from './../SideNavigation.js';
 import TopBar from './../TopBar.js';
 import DataViewer from '../DataViewer';
 
  /**
  * The component that will be exported. This page will have an Add form 
  * and list the Professors that have been added and
  * the professors that are in the database.
  * 
  * @param onAddProfessor - The function 'addProfessor' from App.js 
  * that will fire when the ProfessorAddPage is submitted
  * @param onEditProfessor - The function 'editProfessor' from App.js
  * that will fire when the edit icon is clicked on a professor object
  * @param professors     - The state of professors passed from App.js
  * @param onDelete       - Handler function that deletes an individual item
  * @param courses        - State variable containing course objects
  */
   const ProfessorAddPage = ({onAddProfessor, onEditProfessor, professors,
    onDelete, courses}) => {

    // Edit functionality state management
    const [profEditedId, setProfEditedId] = useState(null);
    const [editedProfessor, setEditedProfessor] = useState(null);
    const [refresh, setRefresh] = useState('');

    // Handles state changes at the start editing
    const onEdit = profId => e => {
      setProfEditedId(profId);
      setEditedProfessor(profId === null ? null : 
        professors.find(p => p.id === profId));
    }

    // Handles state changes at the end of editing
    const resetState = () => {
      setEditedProfessor(null);
      setProfEditedId(null);
      setRefresh('Refresh');
    }

    // Styling
    const itemHeight = 48;
    const itemPaddingTop = 8;
    const menuProps = {
      sx: {
        "&& .Mui-selected": {
          backgroundColor: "#D0D9DD"
        }
      },
      PaperProps: {
        style: {
          maxHeight: itemHeight * 4.5 + itemPaddingTop,
          width: 250,
        },
      }
    };
    
    /**
      * This function works in tandem to other validating functions
      * This updates state with the passed state setter if 
      * the passed validate function returns true
      * 
      * @param validateFN  - Validating function
      * @param stateSetter - State updating function
      */
    const validate = (validateFN, stateSetter) => e => {
      stateSetter(oldValue => 
        validateFN(e.target.value) ? e.target.value : oldValue);
    }
      
    /**
      * This component represents the form that will be used by 
      * the user to enter in new professor data.
      * 
      * @param onAddProfessor - The addSubmit function that is passed from App
      * @param onEditProfessor - The function that is passed down from App
      * @param courses        - State variable containing course objects
      * @returns              - React component div used to enter 
      *                         and submit professor information
      */
    const ProfessorAdd = ({onAddProfessor, onEditProfessor, courses}) => {
      const [firstName, setFirstName] = useState(profEditedId === 
        null ? '' : editedProfessor.firstName);
      const [lastName, setLastName] = useState(profEditedId === 
        null ? '' : editedProfessor.lastName);
      const [email, setEmail] = useState(profEditedId === 
        null ? '' : editedProfessor.email);
      const [teachLoad, setTeachLoad] = useState(profEditedId === 
        null ? '6' : editedProfessor.teachLoad);
      const [canTeach, setCanTeach] = useState(profEditedId === 
        null ? [] : editedProfessor.canTeach);
      const [wantTeach, setWantTeach] = useState(profEditedId === 
        null ? [] : editedProfessor.wantTeach);
    
                            // Input Validation
      /**
        * This function enforces that the input is an int 0-20, with a .5,
        * and an empty string
        * 
        * @param val - Input value
        * @returns   - True if the input is valid, otherwise false
        */
      const validTeachingLoad = val => 
      [...val.matchAll(/(1[0-9]|20|[0-9])?(\.[5]{0,1})?/g)].some
      (x => x[0] === val) || val === '';
    
      // This function calls passes other functions to validate
      const validateTeachLoad = validate(validTeachingLoad, setTeachLoad);
        
      /**
        * This function enforces that the input is alphanumeric lower or
        * upper case or ' '
        * 
        * @param name - Input value
        * @returns    - True if the input is valid, otherwise false
        */
      const validNameChars = name => 
      name.split('').every(c => new Array(26).fill(true).map((e, i) => 
      String.fromCharCode(i + 97)).concat(new Array(26).fill(true).map((e, i) =>
      String.fromCharCode(i + 97)).map(x => 
        x.toUpperCase())).concat(' ').includes(c));
      
      /**
        * This function enforces that the input is alphanumeric lower or 
        * upper case or ' '
        * 
        * @param email - Input value
        * @returns    - True if the input is valid, otherwise false
        */
      const validEmailChars = email => 
      email.split('').every(c => new Array(26).fill(true).map((e, i) => 
      String.fromCharCode(i + 97)).concat(new Array(26).fill(true).map((e, i) => 
      String.fromCharCode(i + 97)).map(x => x.toUpperCase())).concat(' ').concat('.').concat('@').concat('0').concat('1').concat('2').concat('3').concat('4').concat('5').concat('6').concat('7').concat('8').concat('9').includes(c));
    
      /**
        *  This function enforces that the input is less than 30 characters
        * 
        * @param name - Input value
        * @returns    - True if the input is valid, otherwise false
        */
      const validNameLength = name => name.length < 31;
      
      // This function combines two different validate functions
      const validName = name => validNameChars(name) && validNameLength(name);
      
      // This function calls passes other functions to validate
      const validateFirstName = validate(validName, setFirstName);
    
      // This function calls passes other functions to validate
      const validateLastName = validate(validName, setLastName);

      // This function combines two different validate functions
      const validEmailText = name => validEmailChars(name) && validNameLength(name);
    
      // This function calls passes other functions to validate
      const validateEmail = validate(validEmailText, setEmail);
    
    
      /**
        * This function handles addition of unique list items and 
        * removal of present list items
        * The imbedded stateSetter updates the state object in one of these ways
        * 
        * @param courseInfo  - Object containing all relevant course information
        * @param stateSetter - State updating function
        */
      const handleClick = (courseInfo, stateSetter) => e => {
        stateSetter(oldValue => {
          if(oldValue.some(x => JSON.stringify(x) === JSON.stringify(courseInfo))) { 
            return oldValue.filter(x => JSON.stringify(x) !== JSON.stringify(courseInfo));
          }
          const newValue = [...oldValue, courseInfo]
          return newValue;
        })
      }
      
    
    
      /**
        * This function alerts the user if they are missing necessary data,
        * if all necessary data is present, it passes the data and resets to default
        * 
        * @param e - Event object
        * @returns - Alert to user
        */
      const onSubmit = (e) => {
        e.preventDefault();
        e.target.reset();
        if (!email) {
          alert('Please enter an email');
          return;
        }
        if (!firstName) {
          alert('Please enter a professor name');
          return;
        }
        if (!lastName) {
          alert('Please enter a professor name');
          return;
        }
        if (!teachLoad) {
          alert('Please enter desired teach load');
          return;
        }
      
            
        let elementClassName = 'item';

        if(profEditedId === null){
          onAddProfessor({firstName, lastName, email, teachLoad, canTeach, 
            wantTeach, elementClassName});
        } else {
          let id = profEditedId;
          onEditProfessor({id, firstName, lastName, email, teachLoad, canTeach, 
            wantTeach, elementClassName});
          resetState();
        }
      
        setFirstName('');
        setLastName('');
        setEmail('');
        setTeachLoad('6');
        setCanTeach([]);
        setWantTeach([]);
      }
      
      
      return (
        <div className = 'body-container'>
          <h2>{profEditedId !== null ? "Edit" : "Add"} A Professor</h2>
          <form onSubmit = {onSubmit}>

          <br></br>

          <Grid container spacing = {2}>
    
            <Grid item xs = {6}>
              <Box>
                <TextField InputLabelProps = {{ shrink: true }} fullWidth id = "enter_first_name" label = "First Name" variant = "outlined" value = {firstName} onChange = {validateFirstName}/>
              </Box>
            </Grid>
            
            <Grid item xs = {6}>
              <Box float = "right" clear = "right">
                <TextField InputLabelProps = {{ shrink: true }} fullWidth id = "enter_last_name" label = "Last Name" variant = "outlined" value = {lastName} onChange = {validateLastName}/>
              </Box>
            </Grid>
    
            <Grid item xs = {6}>
              <Box>
                <TextField InputLabelProps = {{ shrink: true }} fullWidth id = "enter_email" label = "Email" variant = "outlined" value = {email} onChange = {validateEmail}/>
              </Box>
            </Grid>
        
            <Grid item xs = {6}>
              <Box>
                <TextField InputLabelProps = {{ shrink: true }} fullWidth id = "enter_teach_load" label = "Teach Load" variant = "outlined" value = {teachLoad} onChange = {validateTeachLoad}/>
              </Box>
            </Grid>
    
            <Grid item xs = {6}>
              <Box sx = {{ minWidth: 120 }}>
                <FormControl fullWidth>
                  <InputLabel shrink id = "label">Courses Professor Can Teach</InputLabel>
                  <Select
                    labelId = "label"
                    id = 'can_teach_dropdown'
                    multiple
                    notched
                    value = {canTeach.map(e => e.name)}
                    label = "Courses Professor Can Teach"
                    input = {<OutlinedInput id = "select-multiple-chip" label = "Courses Professor Can Teach" />}
                    
                    renderValue = {(selected) => (
                      <Box sx = {{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key = {value} label = {value} />
                        ))}
                      </Box>
                    )}
                    MenuProps = {menuProps}
                  >
                    {courses.map(p => (
                      <MenuItem 
                        onClick = {handleClick(p, setCanTeach)}
                        key = {p.id} 
                        value = {p.id}
                      >
                        {p.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Grid>
                    
            <Grid item xs = {6}>
              <Box sx = {{ minWidth: 120 }}>
                <FormControl fullWidth>
                  <InputLabel shrink id = "label">Courses Professor Want to Teach</InputLabel>
                  <Select
                    labelId = "label"
                    id = 'want_teach_dropdown'
                    multiple
                    notched
                    value = {wantTeach.map(e => e.name)}
                    label = "Courses Professor Want to Teach"
                    input = {<OutlinedInput id = "select-multiple-chip" label = "Courses Professor Want to Teach" />}
                    renderValue = {(selected) => (
                      <Box sx = {{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key = {value} label = {value} />
                        ))}
                      </Box>
                    )}
                    MenuProps = {menuProps}
                  >
                    {canTeach.map(p => (
                      <MenuItem 
                        onClick = {handleClick(p, setWantTeach)}
                        key = {p.id} 
                        value = {p.name}
                      >
                        {p.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Grid>
          </Grid>
    
          <br></br>
    
          {profEditedId === null ? <input type = "submit" value = 'Save Professor' className = 'btn btn-block'/> 
          : <><input type = "submit" value = 'Save Edits' className = 'btn btn-block'/><br /> 
              <input type = "button" value = "Cancel Edits" className = 'btn btn-block' onClick = {resetState}/></> }

          </form>
        </div>
      );
    }
      
    /**
      * This component is a view that lists out individual ProfessorListItems.
      * 
      * @param professors - The state of professors that is passed down from App.js
      * @param onDelete   - Handler function that deletes an individual item from the list
      * @param onEdit     - Handler function that edits an individual item from the list
      * @returns          - React component that lists viewable professor components
      */
    const ProfessorList = ({professors, onDelete, onEdit}) => {
      return (
        <div className = 'container'>
        {professors.map((currentProfessor, index) => (
          <ProfessorListItem key = {index} professor = {currentProfessor}
          onDelete = {onDelete} onEdit = {onEdit} professors = {professors}/>
        ))}
        </div>
      );
    }
      
      
    /**
      * The component that will display an individual professor. These components will populate the ProfessorList component.
      * 
      * @param professor - An individual professor
      * @param onDelete  - Handler function that deletes an individual item from the list
      * @param onEdit    - Handler function that edits an individual item from the list
      * @param professors - state of created professor objects
      * @returns         - React component that displays a single professor component
      */
    const ProfessorListItem = ({professor, onDelete, onEdit, professors}) => {
      return (
        <div className = 'item'>
          <FaTimes style = {{color: 'red', cursor: 'pointer', float:"right"}} onClick = {() => onDelete(professor.id)}/>
          <FaPencilAlt style = {{color:'#90A4AE', cursor: 'pointer', float: "right", clear: "right"}} onClick = {onEdit(professor.id)}/>
          <DataViewer id = {professor.id} dataState = {professors} sx = {{position:'absolute'}}>
            <h3> {professor.firstName} {professor.lastName}</h3>
          </DataViewer>
        </div>
      );
    }
    
    /**
      * This page will have an Add form and list the Professors that have been added and
      * the professors that are in the database.
      * 
      * @param onAddProfessor - The function 'addProfessor' from App.js that will 
      *                         fire when the ProfessorAddPage is submitted
      * @param onEditProfessor - The function 'editProfessor' from App.js that will
      *                          fire when the edit icon is clicked on a professor item
      * @param professors     - The state of professors passed from App.js
      * @param onDelete       - Handler function that deletes an individual item from the list
      * @param courses        - State variable containing course objects
      */
      const ProfessorAddPageContent = ({onAddProfessor, onEditProfessor, professors, onDelete, courses}) => {    
    
      return (
        <div className = "home">
          <div className = 'element-page'>
            <ProfessorAdd onAddProfessor = {onAddProfessor} onEditProfessor = {onEditProfessor} courses = {courses}/>
            <ProfessorList onDelete = {onDelete} professors = {professors} onEdit = {onEdit}/> 
          </div>
        </div>
      );
    }
 
    useEffect(() => {

    }, [profEditedId, refresh])

   return (
     <div>
       <SideNavigation></SideNavigation>
 
       <div id = "main">
           <div className = "main-div">
               <TopBar></TopBar>
 
               <div className = "container-home">
                 <ProfessorAddPageContent onAddProfessor = {onAddProfessor} onEditProfessor = {onEditProfessor} professors = {professors} onDelete = {onDelete} courses = {courses}></ProfessorAddPageContent>
               </div>
           </div>
       </div>
     </div>
   );
 }
 
 export default ProfessorAddPage;