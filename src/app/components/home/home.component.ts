import { Component, OnInit } from '@angular/core';
import {DataServiceService} from '../../services/data-service.service';
import {GlobalDataSummary} from '../../models/global-data';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

	totalConfirmed = 0;
	totalActive = 0;
	totalDeaths = 0;
	totalRecovered = 0;
	globalData: GlobalDataSummary[];
	chart = {
		PieChart: "PieChart",
		ColumnChart: 'ColumnChart',
		LineChart: 'LineChart',
		height: 500,
		options: {
			animation: {
				duration: 1000,
				easing: 'out'
			},
			is3D: true
		}
	}
	dataTable:any[];
  constructor(private dataService: DataServiceService) { }

	initChart(caseType: string) {
		let value:number;
		
		this.dataTable = [];
		
		
		this.globalData.forEach(cs => {
			
			if(caseType == 'c') {
				if(cs.confirmed > 2000)  value = cs.confirmed;
			}
			else if(caseType=='a') {
				if(cs.active > 2000) value = cs.active;
			}
			else if(caseType == 'd') {
				if(cs.deaths > 1000) value = cs.deaths;
			}
			else if(caseType == 'r') {
				if(cs.recovered > 2000) value = cs.recovered;
			}
			
			this.dataTable.push([
				cs.country, value
			])
		})
		
		
	}
	
  ngOnInit(): void {
	  this.dataService.getGlobalData().subscribe({
		  next: (result) => {
			  console.log(result);
			  this.globalData = result;
			  result.forEach(cs => {
				  this.totalActive+=(!Number.isNaN(cs.active)) ? cs.active : 0;
				  this.totalRecovered+=(!Number.isNaN(cs.recovered)) ? cs.recovered : 0;
				  this.totalDeaths+=(!Number.isNaN(cs.deaths)) ? cs.deaths : 0;
				  this.totalConfirmed+=(!Number.isNaN(cs.confirmed)) ? cs.confirmed : 0;
		  
			  })
			  
			  this.initChart('c');
		  },
	  }
	  
	  )
  }
	
	updateChart(caseType: string) {
		this.initChart(caseType);
	}

}
