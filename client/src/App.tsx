import React from 'react';
import './App.scss';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import Pagination from "@material-ui/lab/Pagination";
import {createApiClient, Ticket} from './api';
import ReactPaginate from 'react-paginate';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
//import 'bootstrap/dist/css/bootstrap.min.css';
import bg from './img/leafbg.jpeg';
import { Container } from '@material-ui/core';
//import 'font-awesome/css/font-awesome.min.css';
import {BsSearch} from "react-icons/bs";
import {GrPin} from "react-icons/gr";
import facebookAdd from "./facebookAddComp/facebookAdd";
//import 'bootstrap/dist/css/bootstrap.min.css';
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Card from 'react-bootstrap/Card'

import './App.scss';

export type AppState = {
	tickets?: Ticket[],
	search: string,
	isDarkMode: boolean,
	pinnedTickets: Ticket[],
	showMore:Ticket[]
	page: number,
	total: number,
	
}

const api = createApiClient();
console.log(api);

export class App extends React.PureComponent<{}, AppState> {
	
	
	state: AppState = {
		search: '',
		isDarkMode: false,
		pinnedTickets: [],	
		showMore: [],
		page: 1,
		total: 0,
	 }
	
	searchDebounce: any = null;

	async componentDidMount() {
		const {tickets, total} = await api.getTickets(this.state.page);
		this.setState({
			tickets,
			total
		});
	}

	renderTickets = (tickets: Ticket[]) => {	
		const isDarkMode = this.state.isDarkMode;	
		let filteredTickets = tickets
			.filter((t) => (t.title.toLowerCase() + t.content.toLowerCase()).includes(this.state.search.toLowerCase()) && !this.state.pinnedTickets.includes(t));
		filteredTickets = ([] as Ticket[]).concat(this.state.pinnedTickets).concat(filteredTickets);
		
		//return (<Tickets ticketsList={tickets} onPin={this.togglePin}></Tickets>)
		//return (<ul className='tickets'>{tickets.map(ticket =>(<Ticket onPin={this.onPin}></Ticket>))}</ul>)
		return (
		<ul className='tickets'>
			{filteredTickets.map((ticket) => (<li key={ticket.id} className={isDarkMode ? 'darkTicket' :'ticket'} >
				<h5>{ticket.title}</h5>
				{tickets ? <p id={ticket.id}> {ticket.content.slice(0,300)}... </p> : null }	
		        {ticket.content.length>300 ? <button className={isDarkMode ? 'showMoreDark-btn' :'showMore-btn'}onClick={()=>this.toggleShowMore(ticket)} >{this.state.showMore.includes(ticket)?'Show less' : 'read more'}</button> : null} 
				<footer>
					<div className='meta-data'>By {ticket.userEmail} | { new Date(ticket.creationTime).toLocaleString()}</div>
					<span className={isDarkMode ? 'pinDark' :'pin'} onClick={() =>this.togglePin(ticket)}>{this.state.pinnedTickets.includes(ticket)?'unpin' : <GrPin/>}</span>
				</footer>
			</li>))}
		</ul>);
	}

	togglePin = (ticket : Ticket) => {
		if(this.state.pinnedTickets.includes(ticket)){
			this.setState({
				pinnedTickets: [...this.state.pinnedTickets.filter(currTicket => currTicket != ticket)],
		
			})
		}	else {
			this.setState({
				pinnedTickets: [...this.state.pinnedTickets, ticket],
		
			})
		}
	}	
	
	toggleShowMore = (ticket : Ticket) => {	
		const content=document.getElementById(ticket.id) as HTMLBodyElement;
		const p=document.createElement("p");
        p.textContent=ticket.content;
		content.textContent=ticket.content;
		if(this.state.showMore.includes(ticket)){
			this.setState({
				showMore: [...this.state.showMore.filter(currTicket => currTicket != ticket)],
		
			})
		p.textContent=ticket.content;
		content.textContent=ticket.content.slice(0,300);
			
		}	else {
			this.setState({
				showMore: [...this.state.showMore, ticket],
		
			})
			p.textContent=ticket.content;
		    content.textContent=ticket.content;
		}
	}	

	onSearch = async (val: string) => {
		clearTimeout(this.searchDebounce);
		this.searchDebounce = setTimeout(async () => {
			const {tickets, total} = await api.searchTickets(val,1);
			this.setState({
				tickets,
				total,
				search: val,
				page: 1,
			});
		}, 300);
	}

	handleModeChange = () => {		
		(document.getElementById('body') as HTMLBodyElement).className = this.state.isDarkMode ? "whiteBody" : "darkBody";
		this.setState({
			isDarkMode: !this.state.isDarkMode								
		});
	}

	
	handlePageChange = async (pageNum: number) => {
		const {tickets, total} = this.state.search ? await api.searchTickets(this.state.search, pageNum) : await api.getTickets(pageNum);
		this.setState({
			tickets,			
			page: pageNum
		});
	}
	
	render() {	
		const {tickets, isDarkMode, page, total} = this.state;
		return (
			<>
			 <Switch
			  checked={isDarkMode}
			  onChange={this.handleModeChange}
			  name="checkedB"
			  color="primary"
          	/>
			  <span>{isDarkMode ? "White Please!" : "Go Dark!"}</span>		
			<main>		
			<header>		
				<h1>Start your search</h1>
			<InputGroup className="search mb-3">
			<FormControl placeholder="Search..." aria-describedby="basic-addon2" onChange={(e) => this.onSearch(e.target.value)}/>
			</InputGroup>	
  			</header>
				{tickets ? <div className='results'>Showing {this.state.total*5} results </div> : null }				
				{tickets ? this.renderTickets(tickets) : <h2>Loading..</h2>}							
			</main>
			<footer className="footer">
				<div className="pagi">
			      <Typography>Page: {page}</Typography>
      			  <Pagination className="pagiIn"count={Math.round(total)} page={page} onChange={(event, num : number) => this.handlePageChange(num)} /> 	
				</div>			  
			</footer>		
		    </>)
	}
}

export default App;