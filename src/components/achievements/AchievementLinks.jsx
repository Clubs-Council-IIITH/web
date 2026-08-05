import {Controller, useFieldArray} from 'react-hook-form'
import { Stack,
        TextField,
        IconButton,
        Button,
        Typography
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
export default function AchievementLinks({control}){
    const {fields, append, remove} = useFieldArray({
        control,
        name:"links",
    })

    return (
        
        <Stack spacing={2}>
            {fields.map(( item, index)=>(
                <Stack direction="row"
                key={`${item.id}`} spacing={1} alignItems="center">
                    <Controller
                    name={`links.${index}.url`}
                    control={control}
                    rules={{
                        required: "Link is required",
                        pattern: {
                            value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,})([/\w .-]*)*\/?$/,
                            message: "Enter a valid URL"
                        }
                    }}
                    render={({field, fieldState: {error}})=>(
                        <TextField
                        {...field} 
                        fullWidth
                        label={`link ${index+1}`}
                        placeholder="https://example.com"
                        error={!!error}
                        helperText={error?.message}
                        />

                    )}
                    />
                    <IconButton 
                         color="error" 
                         onClick={() => remove(index)}
                         disabled={fields.length === 0}
                         aria-label="Delete link"
                    >
                        <DeleteIcon />
                    </IconButton>

                </Stack>

            ))}

            <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => append({ url: '' })}
                disabled = {fields.length==5}
                sx={{ alignSelf: 'flex-start' }}
            >
                Add Another Link
             </Button>


        </Stack>


    )
}