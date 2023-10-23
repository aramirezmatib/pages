import React, { useEffect, useState } from 'react';
import { Autocomplete, TextField } from '@mui/material';

export default function MuiAutocomplete({ data, placeholder }: { data: string, placeholder: string }) {

    const [items, setItems] = useState([])

    useEffect(() => {
        if (data) {
            setItems(data.split(','))
        }
    }, [data])

    return <Autocomplete
        disablePortal
        id="combo-box-demo"
        options={items}
        sx={{ width: '100%', minHeight:'30' }}
        renderInput={(params) => <TextField {...params} label={placeholder} />}
    />
}

