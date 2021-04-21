import { tempData } from '../temp-data';
import mongoose from 'mongoose'
import {Tickets} from "../models/tickets";

export const firstTimeInsert = async () => {
    for (const ticket of tempData) {
        await Tickets.create({...ticket});       
    }        
}