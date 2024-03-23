// // The form goes here

// "use client";

// import { useState, useEffect } from "react";

// import { LoadingButton } from "@mui/lab";
// import {
//   Box,
//   Button,
//   Chip,
//   Grid,
//   Fade,
//   CircularProgress,
//   TextField,
//   Typography,
//   ToggleButtonGroup,
//   ToggleButton,
//   FormHelperText,
//   FormControl,
//   InputLabel,
//   OutlinedInput,
//   Select,
//   MenuItem,
// } from "@mui/material";

// import ConfirmDialog from "components/ConfirmDialog";

// export default function RecruitmentForm({ user = {} }) {
//   const [loading, setLoading] = useState(false);
//   const [open, setOpen] = useState(false);
//   const [sent, setSent] = useState(false);
//   const [values, setValues] = useState({
//     teams: [],
//     whyCc: "",
//     whyThisPosition: "",
//     designExperience: "",
//   });

//   const handleChange = (prop) => (event) => {
//     setValues({ ...values, [prop]: event.target.value });
//   };

//   const handleTeamChange = (event, newTeams) => {
//     setValues({ ...values, teams: newTeams });
//   };

//   const handleSend = async () => {
//     setLoading(true);
//     try {
//       await getClient().mutate({
//         mutation: APPLY_FOR_CC,
//         variables: values,
//       });
//       setSent(true);
//     } catch (e) {
//       console.error(e);
//     }
//     setLoading(false);
//   };

//   const handleOpen = () => {
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//   };

//   useEffect(() => {
//     if (sent) {
//       setTimeout(() => {
//         router.push("/cc-recruitments");
//       }, 1000);
//     }
//   }, [sent]);

//   return (
//     <Box>
//       <Typography variant="h4" gutterBottom>
//         Apply for CC
//       </Typography>
//       <Typography variant="body1" gutterBottom>
//         Please fill out the form below to apply for the CC.
//       </Typography>
//       <Grid container spacing={2}>
//         <Grid item xs={12}>
//           <FormControl fullWidth>
//             <InputLabel id="teams-label">Teams</InputLabel>
//             <Select
//               labelId="teams-label"
//               id="teams"
//               multiple
//               value={values.teams}
//               onChange={handleTeamChange}
//               input={<OutlinedInput />}
//               renderValue={(selected) => (
//                 <div>
//                   {selected.map((value) => (
//                     <Chip key={value} label={value} />
//                   ))}
//                 </div>
//               )}
//             >
//               {["Design", "Frontend", "Backend", "DevOps", "Marketing"].map(
//                 (team) => (
//                   <MenuItem key={team} value={team}>
//                     {team}
//                   </MenuItem>
//                 )
//               )}
//             </Select>
//             <FormHelperText>
//               Select the teams you are interested in joining.
//             </FormHelperText>
//           </FormControl>
//         </Grid>
//         <Grid item xs={12}>
//           <TextField
//             fullWidth
//             multiline
//             rows={4}
//             variant="outlined"
//             label="Why do you want to join CC?"
//             value={values.whyCc}
//             onChange={handleChange("whyCc")}
//           />
//         </Grid>
//         <Grid item xs={12}>
//           <TextField
//             fullWidth
//             multiline
//             rows={4}
//             variant="outlined"
//             label="Why do you want to join this position?"
//             value={values.whyThisPosition}
//             onChange={handleChange("whyThisPosition")}
//           />
//         </Grid>
//         <Grid item xs={12}>
//           <TextField
//             fullWidth
//             multiline
//             rows={4}
//             variant="outlined"
//             label="Design experience"
//             value={values.designExperience}
//             onChange={handleChange("designExperience")}
//           />
//         </Grid>
//         <Grid item xs={12}>
//           <LoadingButton
//             variant="contained"
//             color="primary"
//             loading={loading}
//             onClick={handleSend}
//           >
//             Submit
//           </LoadingButton>
//         </Grid>
//       </Grid>
//       <ConfirmDialog
//         open={open}
//         onClose={handleClose}
//         title="Application Submitted"
//         content="Your application has been submitted successfully."
//       />
//     </Box>
//   );
// }
