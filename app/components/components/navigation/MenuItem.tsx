import { useEffect, useState } from 'react';
import { MenuItem as MuiMenuItem, Typography } from '@mui/material';
import { PropsWithChildren } from 'react'

export function MenuItem({ children }: PropsWithChildren) {
    return <MuiMenuItem><Typography textAlign="center">{children}</Typography></MuiMenuItem>
}