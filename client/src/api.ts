import axios from 'axios';
import {APIRootPath} from '@fed-exam/config';

export type Ticket = {
    id: string,
    title: string;
    content: string;
    creationTime: number;
    userEmail: string;
    labels?: string[];
}

export type TicketResponse = {
    tickets: Ticket[],
    total: number
}


export type ApiClient = {
    getTickets: (pageNum:number) => Promise<TicketResponse>;
    searchTickets:(searchString: string, page: number) => Promise<TicketResponse>;
}

export const createApiClient = (): ApiClient => {
    return {
        getTickets: (pageNum) => {
            return axios.get(APIRootPath, {
                params: {
                  page: pageNum
                }}).then((res) => res.data);
        },
        searchTickets: (searchString :string, pageNum: number) => {
            return axios.get(APIRootPath, {
                    params: {
                      search: searchString,
                      page: pageNum
                }}).then((res) => res.data);
        },
        

    }
}
